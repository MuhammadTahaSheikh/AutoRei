import os
import boto3
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify, current_app as app
from app.models.properties import Properties
from homeharvest import scrape_property
from flask_cors import CORS
import math
from decimal import Decimal
from datetime import datetime
import jwt
import pandas as pd
import csv
import requests

load_dotenv()
properties = Blueprint('properties', __name__)
CORS(properties)
FRED_API_KEY = '0ba3d29d551472babf68470da76ed448'
SERIES_ID = 'FEDFUNDS'
properties_model = Properties()

def replace_nan_with_none(data):
    if isinstance(data, dict):
        return {k: (None if (isinstance(v, float) and math.isnan(v)) else v) for k, v in data.items()}
    elif isinstance(data, list):
        return [replace_nan_with_none(item) for item in data]
    return data

def replace_empty_with_none(item):
    if isinstance(item, dict):
        for key, value in item.items():
            if value == '<empty>':
                item[key] = None
    elif isinstance(item, list):
        return [replace_empty_with_none(sub_item) for sub_item in item]
    return item

def convert_floats_to_decimals(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, float):
                data[key] = Decimal(str(value))
            elif isinstance(value, dict) or isinstance(value, list):
                convert_floats_to_decimals(value)
    elif isinstance(data, list):
        for index, value in enumerate(data):
            if isinstance(value, float):
                data[index] = Decimal(str(value))
            elif isinstance(value, dict) or isinstance(value, list):
                convert_floats_to_decimals(value)
    return data
def clean_payload(payload):
    """
    Remove fields with null, empty, zero, or whitespace-only string values, and empty arrays from the payload.
    Recursively clean nested dictionaries.
    """
    def clean(value):
        if isinstance(value, dict):
            return {k: clean(v) for k, v in value.items() if v not in [None, '', ' ', 0, []]}
        return value

    return {k: clean(v) for k, v in payload.items() if v not in [None, '', ' ', 0, []]}

@properties.route('/api/properties-scrape', methods=['GET'])
def get_properties_scrape():
    try:
        properties_df = scrape_property(
            location=os.getenv('LOCATION'),
            listing_type=os.getenv('LISTING_TYPE'),
            past_days=os.getenv('PAST_DAYS')
        )
        data = properties_df.to_dict(orient='records')
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@properties.route('/api/properties', methods=['POST'])
def add_properties():
    try:
        properties_df = scrape_property(
            location=os.getenv('LOCATION'),
            listing_type=os.getenv('LISTING_TYPE'),
            past_days=os.getenv('PAST_DAYS'),
        )
        data = properties_df.to_dict(orient='records')

        new_properties = []

        for item in data:
            item = replace_nan_with_none(item)
            item = replace_empty_with_none(item)
            item = convert_floats_to_decimals(item)
            alt_photos_string = item.get('alt_photos', '')
            alt_photos_list = [url.strip() for url in alt_photos_string.split(',')] if alt_photos_string else []

            # Split agent and broker names
            agent_name = item.get('agent', '') or ''
            broker_name = item.get('broker', '') or ''

            agent_name_parts = agent_name.split() if agent_name else []
            broker_name_parts = broker_name.split() if broker_name else []

            agent_first_name = agent_name_parts[0] if agent_name_parts else ''
            agent_last_name = ' '.join(agent_name_parts[1:]) if len(agent_name_parts) > 1 else ''

            broker_first_name = broker_name_parts[0] if broker_name_parts else ''
            broker_last_name = ' '.join(broker_name_parts[1:]) if len(broker_name_parts) > 1 else ''

            property_data = {
                'agent_first_name': agent_first_name,
                'agent_last_name': agent_last_name,
                'agent_email': item.get('agent_email'),
                'assessed_value': item.get('assessed_value'),
                'broker_first_name': broker_first_name,
                'broker_last_name': broker_last_name,
                'broker_phone': item.get('broker_phone'),
                'broker_website': item.get('broker_website'),
                'fips_code': item.get('fips_code'), 
                'hoa_fee': item.get('hoa_fee'),
                'nearby_schools': item.get('nearby_schools'),
                'location': f"{item.get('street')}, {item.get('city')}, {item.get('state')} {item.get('zip_code')}".lower(),
                'is_property_detail': False,
                'alt_photos': alt_photos_list,
                'beds': item.get('beds'),
                'city': item.get('city'),
                'county': item.get('county'),
                'days_on_mls': item.get('days_on_mls'),
                'full_baths': item.get('full_baths'),
                'full_street_address': item.get('full_street_line'),
                'half_baths': item.get('half_baths'),
                'last_sold_date': item.get('last_sold_date'),
                'latitude': item.get('latitude'),
                'list_date': item.get('list_date'),
                'list_price': item.get('list_price'),
                'estimated_value': item.get('estimated_value'),
                'longitude': item.get('longitude'),
                'lot_sqft': item.get('lot_sqft'),
                'mls': item.get('mls'),
                'mls_id': item.get('mls_id'),
                'neighborhoods': item.get('neighborhoods'),
                'parking_garage': item.get('parking_garage'),
                'price_per_sqft': item.get('price_per_sqft'),
                'primary_photo': item.get('primary_photo'),
                'sold_price': item.get('sold_price'),
                'sqft': item.get('sqft'),
                'state': item.get('state'),
                'status': item.get('status'),
                'stories': item.get('stories'),
                'street': item.get('street'),
                'style': item.get('style'),
                'unit': item.get('unit'),
                'year_built': item.get('year_built'),
                'zip_code': item.get('zip_code'),
                'created_at': datetime.utcnow().isoformat()
            }

            existing_property = properties_model.query_properties_by_mls_id(item.get('mls_id'))
            if not existing_property:
                new_properties.append(property_data)

        properties_model.add_properties_batch(new_properties)

        return jsonify({'message': 'Properties added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# @properties.route('/api/properties', methods=['GET'])
# def get_properties():
#     try:
#         # Get properties data
#         page = request.args.get('page', 1, type=int)
#         per_page = 50
#         properties_data, total_properties = properties_model.get_properties(page, per_page)
#         total_pages = total_properties // per_page + (1 if total_properties % per_page > 0 else 0)

#         # Get interest rate data
#         url = f'https://api.stlouisfed.org/fred/series/observations?series_id={SERIES_ID}&api_key={FRED_API_KEY}&file_type=json'
#         response = requests.get(url)
#         response.raise_for_status()
#         data = response.json()
#         observations = data.get('observations', [])

#         interest_rate_info = []
#         if observations:
#             for observation in observations:
#                 year = observation.get('date')  # The 'date' field from FRED
#                 interest_rate_value = observation.get('value')  # The 'value' field from FRED
#                 interest_rate_info.append({
#                     'year': year,
#                     'interest_rate': interest_rate_value
#                 })

#         # Combine the properties data and interest rate into one response
#         return jsonify({
#             'properties': properties_data,
#             'total_pages': total_pages,
#             'current_page': page,
#             'interest_rate': interest_rate_info
#         }), 200

#     except requests.exceptions.RequestException as e:
#         return jsonify({'error': f'Failed to fetch interest rate: {str(e)}'}), 500
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


@properties.route('/api/properties', methods=['GET'])
def get_properties():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = 50
        properties_data, total_properties, total_pages = properties_model.get_properties(page, per_page)

        # Get interest rate data
        url = f'https://api.stlouisfed.org/fred/series/observations?series_id={SERIES_ID}&api_key={FRED_API_KEY}&file_type=json'
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        observations = data.get('observations', [])

        interest_rate_info = []
        if observations:
            for observation in observations:
                year = observation.get('date')  # The 'date' field from FRED
                interest_rate_value = observation.get('value')  # The 'value' field from FRED
                interest_rate_info.append({
                    'year': year,
                    'interest_rate': interest_rate_value
                })

        # Combine the properties data and interest rate into one response
        return jsonify({
            'properties': properties_data,
            'total_pages': total_pages,
            'current_page': page,
            'interest_rate': interest_rate_info
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@properties.route('/api/properties-sequential', methods=['GET'])
def get_paginated_properties():
    try:
        # Get query parameters for pagination
        current_page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 50))
        last_evaluated_key = request.args.get('last_evaluated_key', None)

        # Decode the last_evaluated_key if provided
        if last_evaluated_key:
            last_evaluated_key = eval(last_evaluated_key)  # convert from string back to dict

        # Retrieve paginated data
        properties_data, new_last_evaluated_key, total_pages = properties_model.get_paginated_properties(limit, last_evaluated_key)

        # Calculate total pages (this is an approximation, actual total pages would require a count operation)
        total_pages = current_page + 1 if new_last_evaluated_key else current_page

        # Response
        return jsonify({
            'properties': properties_data,
            'current_page': current_page,
            'total_pages': total_pages,
            'last_evaluated_key': (new_last_evaluated_key) if new_last_evaluated_key else None
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
    
@properties.route('/api/properties-range', methods=['GET'])
def get_properties_with_range():
    current_page = int(request.args.get('page', 1))
    end_range = current_page * 50
    start_range = end_range - 49

    start_pos = start_range
    end_pos = end_range

    # return [start_pos, end_pos]

    try:
        # Retrieve the properties from the specified range
        properties_data, total_pages = properties_model.get_properties_in_range(start_pos, end_pos)
        
        return jsonify({
            'properties': properties_data,
            'total_pages': total_pages,
            'current_page': current_page
        }), 200
    except Exception as e:
        app.logger.error(f"Error retrieving properties: {e}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
    
@properties.route('/api/properties/<string:id>', methods=['GET'])
def get_property_by_id(id):
    try:
        property = properties_model.get_property_by_id(id)

        if property is None:
            return jsonify({'error': 'Property not found'}), 404
    
        return jsonify(property), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@properties.route('/api/properties/filter', methods=['POST'])
def filter_properties():
    try:
        filters = clean_payload(request.json)
        page = request.args.get('page', 1, type=int)
        per_page = 50

        filtered_properties = None
        total_properties = 0
        # return filters['bridgeData']

        # if filters['bridgeData']=='false':
        #     print("RUN1")
        #     filtered_properties, total_properties = properties_model.filter_properties(filters, page, per_page)

        # if not filtered_properties or filters['bridgeData']=='true':
        if filters['bridgeData']:
            try:
                print('RUN2')
                access_token = os.getenv('BRIDGE_API_ACCESS_TOKEN')
                property_base_url = os.getenv('BRIDGE_PROPERTY_URL')
                transaction_base_url = 'https://api.bridgedataoutput.com/api/v2/pub/transactions'
                zestimate_base_url = 'https://api.bridgedataoutput.com/api/v2/zestimates_v2/zestimates'
                
                property_filter_conditions = []
                transaction_filter_conditions = []
                zestimate_filter_conditions = []
                bridge_default_size=filters['bridge_default_size']
                bridge_default_skip=page * bridge_default_size
                bridge_default_skip=bridge_default_skip-25

                if 'address' in filters:
                    property_filter_conditions.append(f"tolower(UnparsedAddress) eq '{filters['address'].lower()}'")
                if 'city' in filters:
                    property_filter_conditions.append(f"tolower(City) eq '{filters['city'].lower()}'")
                if 'county' in filters:
                    property_filter_conditions.append(f"tolower(CountyOrParish) eq '{filters['county'].lower()}'")
                if 'state' in filters:
                    property_filter_conditions.append(f"tolower(StateOrProvince) eq '{filters['state'].lower()}'")
                if 'zip' in filters:
                    property_filter_conditions.append(f"PostalCode eq '{filters['zip']}'")
                if 'property_type' in filters:
                    property_filter_conditions.append(f"PropertyType eq '{filters['property_type']}'")
                if 'mls_listing_price' in filters:
                    property_filter_conditions.append(f"ListPrice eq {filters['mls_listing_price']}")
                if 'list_price' in filters:
                    property_filter_conditions.append(f"ListPrice eq {filters['list_price']}")
                if 'beds' in filters:
                    property_filter_conditions.append(f"BedroomsTotal eq {filters['beds']}")
                if 'baths' in filters:
                    property_filter_conditions.append(f"BathroomsFull eq {filters['baths']}")
                if 'stories' in filters:
                    property_filter_conditions.append(f"StoriesTotal eq {filters['stories']}")
                if 'lot_size' in filters:
                    property_filter_conditions.append(f"LotSizeAcres eq {filters['lot_size']}")
                if 'building_size' in filters:
                    property_filter_conditions.append(f"LotSizeSquareFeet eq {filters['building_size']}")
                if 'year_built' in filters:
                    property_filter_conditions.append(f"YearBuilt eq {filters['year_built']}")
                if 'years_owned' in filters:
                    property_filter_conditions.append(f"YearsCurrentOwner eq {filters['years_owned']}")
                if 'tax_delinquent_year' in filters:
                    property_filter_conditions.append(f"TaxYear eq {filters['tax_delinquent_year']}")
                if 'assessed_value' in filters:
                    property_filter_conditions.append(f"TaxAssessedValue eq {filters['assessed_value']}")
                if 'mls_days_on_market' in filters:
                    property_filter_conditions.append(f"DaysOnMarket eq {filters['mls_days_on_market']}")
                if 'pre_foreclosure_date' in filters:
                    transaction_filter_conditions.append(f"installmentDueDate eq '{filters['pre_foreclosure_date']}'")
                if 'auctionDate' in filters:
                    transaction_filter_conditions.append(f"auctionDate eq '{filters['auctionDate']}'")
                if 'est_value' in filters:
                    zestimate_filter_conditions.append(f"zestimate eq '{filters['est_value']}'")

                property_filter_query = ' and '.join(property_filter_conditions).replace("\n", "").strip()
                property_url = f"{property_base_url}?access_token={access_token}&$skip={bridge_default_skip}&$top={bridge_default_size}&$filter={property_filter_query}".replace("\n", "")
                # return property_url

                property_external_response = requests.get(property_url)
                property_external_response.raise_for_status()
                property_external_data = property_external_response.json()
                bridgeApi_properties = property_external_data.get('value', [])
                # return bridgeApi_properties
                
                if not bridgeApi_properties:
                    return jsonify({'message': 'No properties found'}), 404
                

                new_properties = []
                for item in bridgeApi_properties:
                    item = replace_nan_with_none(item)
                    item = replace_empty_with_none(item)
                    item = convert_floats_to_decimals(item)
                    media_urls = [media_item['MediaURL'] for media_item in item.get('Media', [])]
                    # return media_urls
                    property_data = {
                        'alt_photos': media_urls,
                        'street': item.get('UnparsedAddress', ''),
                        'city': item.get('City', ''),
                        'county': item.get('CountyOrParish', ''),
                        'state': item.get('StateOrProvince', ''),
                        'zip_code': item.get('PostalCode', ''),
                        'location': f"{item.get('UnparsedAddress', '')}, {item.get('City', '')}, {item.get('CountyOrParish', '')}, {item.get('StateOrProvince', '')} {item.get('PostalCode', '')}".lower(),
                        'location_for_transaction': f"{item.get('UnparsedAddress', '')}, {item.get('City', '')}, {item.get('StateOrProvince', '')} {item.get('PostalCode', '')}".lower(),
                        'location_for_zestimate': f"{item.get('UnparsedAddress', '')}, {item.get('City', '')}, {item.get('StateOrProvince', '')} {item.get('PostalCode', '')}".lower(),
                        'TaxAnnualAmount': item.get('TaxAnnualAmount', 0),
                        'TaxAssessedValue': item.get('TaxAssessedValue', 0),
                        'TaxBlock': item.get('TaxBlock', 0),
                        'TaxLot': item.get('TaxLot', 0),
                        'TaxYear': item.get('TaxYear', 0),
                        'latitude': item.get('Latitude', 0),
                        'longitude': item.get('Longitude', 0),
                        'lot_sqft': item.get('LotSizeAcres', 0),
                        'listingAmount': item.get('ListPrice', 0),
                        'days_on_mls': item.get('DaysOnMarket', 0),
                        'list_date': item.get('OnMarketDate', ''),
                        'list_price': item.get('ListPrice', 0),
                        'garage': item.get('AttachedGarageYN', ''),
                        'sqft': item.get('LotSizeSquareFeet', 0),
                        'stories': item.get('StoriesTotal', 0),
                        'year_built': item.get('YearBuilt', 0),
                        'STELLAR_AuctionFirmURL': item.get('STELLAR_AuctionFirmURL', ''),
                        'STELLAR_AuctionPropAccessYN': item.get('STELLAR_AuctionPropAccessYN', ''),
                        'STELLAR_AuctionTime': item.get('STELLAR_AuctionTime', ''),
                        'STELLAR_AuctionType': item.get('STELLAR_AuctionType', ''),
                        'basement': item.get('Basement', []),
                        'full_baths': item.get('BathroomsFull', 0),
                        'half_baths': item.get('BathroomsHalf', 0),
                        'beds': item.get('BedroomsTotal', 0),
                        'Documents': item.get('Documents', []),
                        'DocumentsChangeTimestamp': item.get('DocumentsChangeTimestamp', ''),
                        'status': item.get('MlsStatus', ''),
                        'OwnerName': item.get('OwnerName', ''),
                        'OwnerPhone': item.get('OwnerPhone', ''),
                        'yearsOwned': item.get('YearsCurrentOwner', 0),
                        'Ownership': item.get('Ownership', ''),
                        'OwnershipType': item.get('OwnershipType', ''),
                        'TotalActualRent': item.get('TotalActualRent', ''),
                        'STELLAR_AnnualRent': item.get('STELLAR_AnnualRent', ''),
                        'ContingentDate': item.get('ContingentDate', ''),
                        'ExpirationDate': item.get('ExpirationDate', ''),
                        'ListingContractDate': item.get('ListingContractDate', ''),
                        'ListAgentAOR': item.get('ListAgentAOR', ''),
                        'ListAgentCellPhone': item.get('ListAgentCellPhone', ''),
                        'ListAgentDesignation': item.get('ListAgentDesignation', []),
                        'ListAgentDirectPhone': item.get('ListAgentDirectPhone', ''),
                        'ListAgentEmail': item.get('ListAgentEmail', ''),
                        'ListAgentFax': item.get('ListAgentFax', ''),
                        'ListAgentFirstName': item.get('ListAgentFirstName', ''),
                        'ListAgentFullName': item.get('ListAgentFullName', ''),
                        'ListAgentHomePhone': item.get('ListAgentHomePhone', ''),
                        'ListAgentKey': item.get('ListAgentKey', ''),
                        'ListAgentKeyNumeric': item.get('ListAgentKeyNumeric', 0),
                        'ListAgentLastName': item.get('ListAgentLastName', ''),
                        'ListAgentMiddleName': item.get('ListAgentMiddleName', ''),
                        'ListAgentMlsId': item.get('ListAgentMlsId', ''),
                        'ListAgentMobilePhone': item.get('ListAgentMobilePhone', ''),
                        'ListAgentNamePrefix': item.get('ListAgentNamePrefix', ''),
                        'ListAgentNameSuffix': item.get('ListAgentNameSuffix', ''),
                        'ListAgentOfficePhone': item.get('ListAgentOfficePhone', ''),
                        'ListAgentOfficePhoneExt': item.get('ListAgentOfficePhoneExt', ''),
                        'ListAgentPager': item.get('ListAgentPager', ''),
                        'ListAgentPreferredPhone': item.get('ListAgentPreferredPhone', ''),
                        'ListAgentPreferredPhoneExt': item.get('ListAgentPreferredPhoneExt', ''),
                        'ListAgentStateLicense': item.get('ListAgentStateLicense', ''),
                        'ListAgentTollFreePhone': item.get('ListAgentTollFreePhone', ''),
                        'ListAgentURL': item.get('ListAgentURL', ''),
                        'ListAgentVoiceMail': item.get('ListAgentVoiceMail', ''),
                        'ListAgentVoiceMailExt': item.get('ListAgentVoiceMailExt', ''),
                        'SpecialListingConditions': item.get('SpecialListingConditions', []),
                        'propertyType': item.get('PropertyType', ''),
                        'unit': item.get('NumberOfUnitsTotal', 0),
                        'response': item,
                        'created_at': datetime.utcnow().isoformat()
                    }
                    new_properties.append(property_data)

                    try:
                        transaction_url = f"{transaction_base_url}?access_token={access_token}&parcels.full={property_data['location_for_transaction']}".replace("\n", "")
                        # return transaction_url
                        transaction_external_response = requests.get(transaction_url)
                        transaction_external_response.raise_for_status()
                        transacion_external_data = transaction_external_response.json()
                        bridgeApi_transactions = transacion_external_data.get('bundle', [])

                        if bridgeApi_transactions:
                            bridgeApi_transactions.sort(
                                key=lambda x: x.get('recordingDate', ''), 
                                reverse=True
                            )
                            if bridgeApi_transactions:
                                transaction_data = bridgeApi_transactions[0]
                                transaction_data = convert_floats_to_decimals(transaction_data)
                                new_transaction_data = {
                                    'installmentDueDate': transaction_data.get('installmentDueDate', ''),
                                    'auctionDate': transaction_data.get('auctionDate', ''),
                                    'recordingDate': transaction_data.get('recordingDate', ''),
                                    'origLoanRecordingDate ': transaction_data.get('origLoanRecordingDate ', ''),
                                    'transaction_response': transaction_data
                                }
                                property_data.update(new_transaction_data)
                        else:
                            new_transaction_data = {
                                'installmentDueDate': '',
                                'auctionDate': '',
                                'recordingDate': '',
                                'origLoanRecordingDate ': '',
                                'transaction_response': {}
                            }
                            property_data.update(new_transaction_data)
                    except requests.exceptions.HTTPError as http_err:
                        print({'message': f"Transaction API Error: {str(http_err)}"}), transaction_external_response.status_code

                    except requests.exceptions.RequestException as req_err:
                        print({'message': f"Transaction API Request Error: {str(req_err)}"}), 500

                    try:
                        print('RUN_ZEstimate')
                        zestimate_url = f"{zestimate_base_url}?access_token={access_token}&address={property_data['location_for_zestimate']}".replace("\n", "")
                        # return zestimate_url
                        zestimate_external_response = requests.get(zestimate_url)
                        zestimate_external_response.raise_for_status()
                        transacion_external_data = zestimate_external_response.json()
                        bridgeApi_zestimate = transacion_external_data.get('bundle', [])
                        # return bridgeApi_zestimate

                        if bridgeApi_zestimate:
                            bridgeApi_zestimate.sort(
                                key=lambda x: x.get('timestamp', ''), 
                                reverse=True
                            )
                            if bridgeApi_zestimate:
                                zestimate_data = bridgeApi_zestimate[0]
                                zestimate_data = convert_floats_to_decimals(zestimate_data)
                                new_zestimate_data = {
                                    'estimated_value': zestimate_data.get('zestimate', 0),
                                    'zestimate_response': zestimate_data
                                }
                                property_data.update(new_zestimate_data)
                        else:
                            new_zestimate_data = {
                                'estimated_value': 0,
                                'zestimate_response': {}
                            }
                            property_data.update(new_zestimate_data)
                    except requests.exceptions.HTTPError as http_err:
                        print({'message': f"Zestimate API Error: {str(http_err)}"}), zestimate_external_response.status_code

                    except requests.exceptions.RequestException as req_err:
                        print({'message': f"Zestimate API Request Error: {str(req_err)}"}), 500

                # return new_properties

                properties_model.add_properties_batch(new_properties)
                bridgeApi_properties_pages = property_external_data.get('@odata.count', 0)
                total_pages=bridgeApi_properties_pages // bridge_default_size + (1 if bridgeApi_properties_pages % bridge_default_size > 0 else 0)
                if total_pages>400:
                    total_pages=400
                # return jsonify(bridgeApi_properties), 201
                # Get interest rate data
                url = f'https://api.stlouisfed.org/fred/series/observations?series_id={SERIES_ID}&api_key={FRED_API_KEY}&file_type=json'
                response = requests.get(url)
                response.raise_for_status()
                data = response.json()
                observations = data.get('observations', [])

                interest_rate_info = []
                if observations:
                    for observation in observations:
                        year = observation.get('date')  # The 'date' field from FRED
                        interest_rate_value = observation.get('value')  # The 'value' field from FRED
                        interest_rate_info.append({
                            'year': year,
                            'interest_rate': interest_rate_value
                })

                # return jsonify({'message': 'Properties updated successfully'}), 201
                return jsonify({
                    'bridgeProperties': new_properties,
                    'total_pages': total_pages,
                    'current_page': page,
                    'interest_rate': interest_rate_info
                }), 200

            except requests.exceptions.HTTPError as http_err:
                # Return the error response from the external API
                property_external_response_msg=property_external_response.json()
                error_message = property_external_response_msg.get('error', {}).get('message')
                return jsonify({'message': error_message}), property_external_response.status_code
            
            except requests.exceptions.RequestException as req_err:
                # Return a generic error message for other request exceptions
                return jsonify({'message': str(req_err)}), 500

        total_pages = total_properties // per_page + (1 if total_properties % per_page > 0 else 0)
        

        return jsonify({
            'properties': filtered_properties,
            'total_pages': total_pages,
            'current_page': page
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# @properties.route('/api/properties-detail/<string:id>', methods=['POST'])
# def detail_properties(id):
#     try:
#         property = clean_payload(request.json)
#         propertyID=id

#         propertyData = properties_model.get_property_by_id(propertyID)
#         is_property_detail=propertyData.get('is_property_detail')

#         if is_property_detail is False:
#             url = os.getenv('PROPERTY_DETAIL_URL')
#             headers = {
#                 "accept": "application/json",
#                 "x-user-id": "UniqueUserIdentifier",
#                 "content-type": "application/json",
#                 "x-api-key": os.getenv('X_API_KEY')
#             }

#             property_external_response = requests.post(url, json=property, headers=headers)
#             property_external_response.raise_for_status()
#             external_data = property_external_response.json()
#             reapi_properties = external_data.get('data', [])

#             if not reapi_properties:
#                 return jsonify({'message': 'Reapi properties detail not found'}), 404
            
#             reapi_properties = replace_nan_with_none(reapi_properties)
#             reapi_properties = replace_empty_with_none(reapi_properties)
#             reapi_properties = convert_floats_to_decimals(reapi_properties)

#             if reapi_properties:
#                 property_details = reapi_properties
#                 attributes = {
#                     'cashSale': property_details.get('cashSale'),
#                     'comps': property_details.get('comps'),
#                     'currentMortgages': property_details.get('currentMortgages'),
#                     'deathTransfer': property_details.get('deathTransfer'),
#                     'deedInLieu': property_details.get('deedInLieu'),
#                     'demographics': property_details.get('demographics'),
#                     'estimatedMortgageBalance': property_details.get('estimatedMortgageBalance'),
#                     'estimatedMortgagePayment': property_details.get('estimatedMortgagePayment'),
#                     'foreclosureInfo': property_details.get('foreclosureInfo'),
#                     'lastSale': property_details.get('lastSale'),
#                     'lastSalePrice': property_details.get('lastSalePrice'),
#                     'lastUpdateDate': property_details.get('lastUpdateDate'),
#                     'lien': property_details.get('lien'),
#                     'loanTypeCodeFirst': property_details.get('loanTypeCodeFirst'),
#                     'loanTypeCodeSecond': property_details.get('loanTypeCodeSecond'),
#                     'lotInfo': property_details.get('lotInfo'),
#                     'mlsHasPhotos': property_details.get('mlsHasPhotos'),
#                     'mlsHistory': property_details.get('mlsHistory'),
#                     'mobileHome': property_details.get('mobileHome'),
#                     'mortgageHistory': property_details.get('mortgageHistory'),
#                     'ownerInfo': property_details.get('ownerInfo'),
#                     'priorId': property_details.get('priorId'),
#                     'propertyInfo': property_details.get('propertyInfo'),
#                     'quitClaim': property_details.get('quitClaim'),
#                     'reapiAvm': property_details.get('reapiAvm'),
#                     'saleHistory': property_details.get('saleHistory'),
#                     'schools': property_details.get('schools'),
#                     'sheriffsDeed': property_details.get('sheriffsDeed'),
#                     'spousalDeath': property_details.get('spousalDeath'),
#                     'taxInfo': property_details.get('taxInfo'),
#                     'taxLien': property_details.get('taxLien'),
#                     'trusteeSale': property_details.get('trusteeSale'),
#                     'warrantyDeed': property_details.get('warrantyDeed'),
#                     'is_property_detail': True
#                 }

#                 attributes = {k: v for k, v in attributes.items() if v is not None}

#                 update_response = properties_model.update_property(propertyID, attributes)

#                 if not update_response:
#                     return jsonify({'message': 'Failed to update reapi property'}), 500

#             return jsonify({'message': 'Successfully updated property'}), 201
#         return jsonify({'message': 'Not hit property detail api'}), 201

#     except requests.exceptions.HTTPError as http_err:
#         # Return the error response from the external API
#         return jsonify({'error': property_external_response.json()}), property_external_response.status_code
#     except requests.exceptions.RequestException as req_err:
#         # Return a generic error message for other request exceptions
#         return jsonify({'error': str(req_err)}), 500

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

    

@properties.route('/api/properties/save-filter', methods=['POST'])
def save_filter_properties():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        decoded_token = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = decoded_token['user_id']
        filters = request.json

        save_filter_response = properties_model.save_filter_properties(user_id, filters)
        
        if isinstance(save_filter_response, str):
            return jsonify({'error': save_filter_response}), 400

        return jsonify({
            'message': 'Filter saved successfully'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@properties.route('/api/property-field-names', methods=['GET'])
def get_property_field_names():
    try:
        field_names = properties_model.get_property_field_names()
        return jsonify(field_names), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# @properties.route('/api/interest-rate', methods=['GET'])
# def get_interest_rate():
#     try:
#         url = f'https://api.stlouisfed.org/fred/series/observations?series_id={SERIES_ID}&api_key={FRED_API_KEY}&file_type=json'
#         response = requests.get(url)
#         response.raise_for_status()  # Raise an exception for HTTP errors

#         data = response.json()
#         observations = data.get('observations', [])
#         if observations:
#             latest_observation = observations[-1]  # Assuming the latest data is at the end
#             return jsonify({
#                 # 'date': latest_observation.get('date'),
#                 'value': latest_observation.get('value')
#             }), 200
#         else:
#             return jsonify({'error': 'No observations found'}), 404
#     except requests.exceptions.RequestException as e:
#         return jsonify({'error': str(e)}), 500
#         # Extract relevant information if necessary
#         # For demonstration, returning raw data. You may need to format it according to your needs
#         return jsonify(data), 200
#     except requests.exceptions.RequestException as e:
#         return jsonify({'error': str(e)}), 500


# File data upload into db
CSV_FILE_PATH ='C:/Users/Huraira Akbar/Desktop/insertPart1.csv'
CHUNK_SIZE = 10000

def clean_header(header):
    """Convert header to lowercase and remove spaces."""
    return header.lower().replace(' ', '_')
def combine_media_urls(row):
    """Combine mediaurl fields into a single alt_photos field."""
    media_urls = [row[f'mediaurl_{i}'] for i in range(1, 101) if f'mediaurl_{i}' in row and pd.notna(row[f'mediaurl_{i}']) and row[f'mediaurl_{i}'] != 'NaN']
    row['alt_photos'] = media_urls
    for i in range(1, 101):
        field_name = f'mediaurl_{i}'
        if field_name in row:
            del row[field_name]
    return row
def add_location_field(row):
    """Add location field with concatenated street, city, and zip_code."""
    street = row.get('street', '')
    city = row.get('city', '')
    zip_code = row.get('zip_code', '')
    location = f"{street} {city} {zip_code}".lower()
    row['location'] = location
    return row
@properties.route('/api/file-data', methods=['POST'])
def get_data():
    if not os.path.exists(CSV_FILE_PATH):
        return jsonify({'error': 'File not found'}), 404

    try:
        for chunk in pd.read_csv(CSV_FILE_PATH, chunksize=CHUNK_SIZE):
            chunk.columns = [clean_header(col) for col in chunk.columns]  # Clean headers
            for index, row in chunk.iterrows():
                try:
                    cleaned_row = {clean_header(col): value for col, value in row.items()}
                    cleaned_row = combine_media_urls(cleaned_row)  # Combine mediaurl fields
                    cleaned_row = add_location_field(cleaned_row)  # Add location field
                    cleaned_row = replace_nan_with_none(cleaned_row)  # Replace NaN with None
                    cleaned_row = replace_empty_with_none(cleaned_row)  # Replace '<empty>' with None
                    cleaned_row = convert_floats_to_decimals(cleaned_row)  # Convert floats to Decimal
                    if 'id' in cleaned_row:
                        cleaned_row['id'] = str(cleaned_row['id'])
                        cleaned_row['mls_id'] = str(cleaned_row['mls_id'])
                        cleaned_row['city'] = str(cleaned_row['city'])
                        cleaned_row['list_date'] = str(cleaned_row['list_date'])

                    result = properties_model.add_file_data_into_db(cleaned_row)
                    if 'error' in result:
                            return jsonify({'error': f'Error inserting row {index}: {result["error"]}'}), 500

                except Exception as row_exception:
                    return jsonify({'error': f'Error processing row {index}: {str(row_exception)}'}), 500

        return jsonify("Properties Inserted Successfully")

    except Exception as e:
        return jsonify({'error': f'Error reading CSV: {str(e)}'}), 500