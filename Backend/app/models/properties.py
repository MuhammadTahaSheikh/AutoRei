import boto3
from boto3.dynamodb.conditions import Key, Attr, Or
from datetime import datetime
import uuid
from decimal import Decimal
import re
from app.models.saveFilter import SaveFilters
from botocore.exceptions import ClientError

class Properties:
    def __init__(self):
        self.table_name = 'properties'
        self.dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
        self.table = self.dynamodb.Table(self.table_name)
        self.create_table()

    def create_table(self):
        existing_tables = [table.name for table in self.dynamodb.tables.all()]
        if self.table_name not in existing_tables:
            self.dynamodb.create_table(
                TableName=self.table_name,
                KeySchema=[
                    {'AttributeName': 'id', 'KeyType': 'HASH'},
                    # { "AttributeName": "created_at", "KeyType": "RANGE" }
                ],
                AttributeDefinitions=[
                    {'AttributeName': 'id', 'AttributeType': 'S'},
                    {'AttributeName': 'mls_id', 'AttributeType': 'S'},
                    {'AttributeName': 'created_at', 'AttributeType': 'S'},
                ],
                GlobalSecondaryIndexes=[
                    {
                        'IndexName': 'mls_id-index',
                        'KeySchema': [
                            {'AttributeName': 'mls_id', 'KeyType': 'HASH'},
                        ],
                        'Projection': {
                            'ProjectionType': 'ALL'
                        },
                        'ProvisionedThroughput': {
                            'ReadCapacityUnits': 10,
                            'WriteCapacityUnits': 10,
                        }
                    },
                    {
                        'IndexName': 'created_at-index',
                        'KeySchema': [
                            {'AttributeName': 'created_at', 'KeyType': 'HASH'},
                        ],
                        'Projection': {
                            'ProjectionType': 'ALL'
                        },
                        'ProvisionedThroughput': {
                            'ReadCapacityUnits': 10,
                            'WriteCapacityUnits': 10,
                        }
                    },
                    {
                    'IndexName': 'id-index',
                    'KeySchema': [
                        {'AttributeName': 'id', 'KeyType': 'HASH'},
                    ],
                    'Projection': {
                        'ProjectionType': 'ALL'
                    },
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 10,
                        'WriteCapacityUnits': 10,
                    }
                }
                ],
                ProvisionedThroughput={
                    'ReadCapacityUnits': 10,
                    'WriteCapacityUnits': 10,
                }
            ).wait_until_exists()

    def add_properties_batch(self, properties_data):
        with self.table.batch_writer() as batch:
            for property_data in properties_data:
                property_data['id'] = str(uuid.uuid4())
                batch.put_item(Item=property_data)

    def add_property(self, property_data):
        # Convert float values to Decimal
        for key, value in property_data.items():
            if isinstance(value, float):
                property_data[key] = Decimal(str(value))
        
        property_data['id'] = str(uuid.uuid4())
        self.table.put_item(Item=property_data)

    def get_property_by_id(self, property_id):
        response = self.table.get_item(
            Key={'id': property_id}
        )
        return response.get('Item')
    
    def update_property(self, property_id, attributes):
        try:
            response = self.table.update_item(
                Key={'id': property_id},
                UpdateExpression="SET " + ", ".join(f"#{k} = :{k}" for k in attributes.keys()),
                ExpressionAttributeNames={f"#{k}": k for k in attributes.keys()},
                ExpressionAttributeValues={f":{k}": v for k, v in attributes.items()},
                ReturnValues="UPDATED_NEW"
            )
            return response
        except ClientError as e:
            print(e.response['Error']['Message'])
            return None

    def query_properties_by_city(self, city):
        response = self.table.query(
            IndexName='city-index',
            KeyConditionExpression=Key('city').eq(city)
        )
        return response['Items']

    def query_properties_by_state_list_date(self, state, list_date):
        response = self.table.query(
            IndexName='state-list_date-index',
            KeyConditionExpression=Key('state').eq(state) & Key('list_date').eq(list_date)
        )
        return response['Items']

    def query_properties_by_mls_id(self, mls_id):
        response = self.table.query(
            IndexName='mls_id-index',
            KeyConditionExpression=Key('mls_id').eq(str(mls_id))
        )
        return response['Items']

    def get_properties(self, page=1, per_page=50):
        response = self.table.scan()
        properties = response['Items']
        
        # Ensure 'created_at' is present and valid in all items
        for prop in properties:
            if 'created_at' not in prop:
                prop['created_at'] = '0000-00-00T00:00:00Z'

        properties_sorted = sorted(properties, key=lambda x: x['created_at'], reverse=True)  # Sort by created_at in descending order

        total_properties = len(properties_sorted)
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        properties_list = properties_sorted[start_idx:end_idx]
        return properties_list, total_properties
    
    # def _get_total_items(self):
    #     total_items = 0
    #     scan_kwargs = {'Select': 'COUNT'}
    #     response = self.table.scan(**scan_kwargs)
    #     total_items += response.get('Count', 0)
    #     # print('total_items = ', total_items)

    #     while 'LastEvaluatedKey' in response:
    #         response = self.table.scan(
    #             **scan_kwargs,
    #             ExclusiveStartKey=response['LastEvaluatedKey']
    #         )
    #         total_items += response.get('Count', 0)
    #         # print('total_items in while= ', total_items)


    #     return total_items

    # def get_properties(self, page=1, per_page=50):
    #     total_items = self._get_total_items()
    #     total_pages = (total_items + per_page - 1) // per_page

    #     start_idx = (page - 1) * per_page
    #     exclusive_start_key = None
    #     # print('exclusive_start_key = ', exclusive_start_key)
    #     items = []

    #     while True:
    #         scan_kwargs = {'Limit': per_page}
    #         if exclusive_start_key:
    #             scan_kwargs['ExclusiveStartKey'] = exclusive_start_key
    #             # print('exclusive_start_key inloop = ', exclusive_start_key)

    #         response = self.table.scan(**scan_kwargs)
    #         items.extend(response.get('Items', []))
    #         exclusive_start_key = response.get('LastEvaluatedKey', None)
    #         # print('exclusive_start_key outloop = ', exclusive_start_key)

    #         if len(items) >= start_idx + per_page or not exclusive_start_key:
    #             break

    #     items_with_created_at = [item for item in items if 'created_at' in item]

    #     # Sort items with 'created_at' in descending order
    #     items_with_created_at_sorted = sorted(items_with_created_at, key=lambda x: x['created_at'], reverse=True)

    #     # Combine sorted items with 'created_at' and unsorted items without 'created_at'
    #     items_sorted = items_with_created_at_sorted

    #     # Pagination slice
    #     properties_list = items_sorted[start_idx:start_idx + per_page]

    #     return properties_list, total_items, total_pages

    def get_total_items(self):
        total_items = 0
        scan_kwargs = {'Select': 'COUNT'}
        response = self.table.scan(**scan_kwargs)
        total_items += response.get('Count', 0)

        while 'LastEvaluatedKey' in response:
            response = self.table.scan(
                **scan_kwargs,
                ExclusiveStartKey=response['LastEvaluatedKey']
            )
            total_items += response.get('Count', 0)
            # print('total_items in while= ', total_items)

        return total_items

    # def get_paginated_properties(self, limit=50, last_evaluated_key=None):
    #     try:
    #         if last_evaluated_key:
    #             response = self.table.scan(
    #                 Limit=limit,
    #                 ExclusiveStartKey=last_evaluated_key
    #             )
    #         else:
    #             response = self.table.scan(Limit=limit)

    #         items = response.get('Items', [])
    #         last_evaluated_key = response.get('LastEvaluatedKey', None)
    #         return items, last_evaluated_key

    #     except ClientError as e:
    #         print(f"Error retrieving properties: {e.response['Error']['Message']}")
    #         return [], None, 0  # Ensure consistent return structure

    def get_paginated_properties(self, limit=25, last_evaluated_key=None):
        try:
            scan_params = {
                'Limit': limit
            }
            
            if last_evaluated_key:
                scan_params['ExclusiveStartKey'] = last_evaluated_key

            response = self.table.scan(**scan_params)

            items = response.get('Items', [])
            last_evaluated_key = response.get('LastEvaluatedKey', None)
            
            # Sort based on 'created_at'
            properties_sorted = sorted(items, key=lambda x: x.get('created_at', '0000-00-00T00:00:00Z'), reverse=True)

            return properties_sorted, last_evaluated_key

        except ClientError as e:
            print(f"Error retrieving properties: {e.response['Error']['Message']}")
            return [], None  # Ensure consistent return structure



    def get_properties_in_range(self, start_pos, end_pos):
        total_items = self._get_total_items()
        total_pages = (total_items + 50 - 1) // 50
        # Using scan is inefficient, but this example uses it for simplicity.
        # Consider using a more optimized approach based on your data structure.
        response = self.table.scan(
            Limit=end_pos,
        )
        
        items = response['Items']
        
        # If we need to paginate until reaching the desired range
        while 'LastEvaluatedKey' in response and len(items) < end_pos:
            response = self.table.scan(
                ExclusiveStartKey=response['LastEvaluatedKey'],
                Limit=end_pos - len(items),
            )
            items.extend(response['Items'])
        
        # Slicing to get only the range we're interested in
        return items[start_pos:end_pos], total_pages


    def filter_properties(self, filters, page=1, per_page=50):
        try:
            filter_expression = Attr('id').exists()
            filters_provided = False
            
            if 'stories' in filters and filters['stories'] is not None:
                stories = filters['stories']
                filter_expression &= Attr('stories').eq(stories)
                filters_provided = True

            if 'building_size' in filters and filters['building_size'] is not None:
                building_size = filters['building_size']
                filter_expression &= Attr('sqft').eq(building_size)
                filters_provided = True

            if 'lot_size' in filters and filters['lot_size'] is not None:
                lot_size = filters['lot_size']
                filter_expression &= Attr('lot_sqft').eq(lot_size)
                filters_provided = True

            if 'year_built' in filters and filters['year_built'] is not None:
                year_built = filters['year_built']
                filter_expression &= Attr('year_built').eq(year_built)
                filters_provided = True
            
            if 'years_owned' in filters and filters['years_owned'] is not None:
                years_owned = filters['years_owned']
                filter_expression &= Attr('yearsOwned').eq(years_owned)
                filters_provided = True

            if 'last_sale_date_min' in filters and 'last_sale_date_max' in filters and filters['last_sale_date_min'] is not None and filters['last_sale_date_max'] is not None:
                last_sale_date_min = filters['last_sale_date_min']
                last_sale_date_max = filters['last_sale_date_max']
                filter_expression &= Attr('last_sold_date').between(last_sale_date_min, last_sale_date_max)
                filters_provided = True
            
            if 'pre_foreclosure_date' in filters and filters['pre_foreclosure_date'] is not None:
                pre_foreclosure_date = filters['pre_foreclosure_date']
                filter_expression &= Attr('installmentDueDate').eq(pre_foreclosure_date)
                filters_provided = True

            if 'last_sale_price_min' in filters and 'last_sale_price_max' in filters and filters['last_sale_price_min'] is not None and filters['last_sale_price_max'] is not None:
                last_sale_price_min = filters['last_sale_price_min']
                last_sale_price_max = filters['last_sale_price_max']
                filter_expression &= Attr('sold_price').between(last_sale_price_min, last_sale_price_max)
                filters_provided = True

            if 'est_value' in filters and filters['est_value'] is not None:
                est_value = filters['est_value']
                filter_expression &= Attr('estimated_value').eq(est_value)
                filters_provided = True

            if 'list_price' in filters  and filters['list_price'] is not None:
                list_price = filters['list_price']
                filter_expression &= Attr('list_price').eq(list_price)
                filters_provided = True
        

            if 'mls_days_on_market' in filters and filters['mls_days_on_market'] is not None:
                mls_days_on_market = filters['mls_days_on_market']
                filter_expression &= Attr('days_on_mls').eq(mls_days_on_market)
                filters_provided = True

            if 'mls_listing_price' in filters and filters['mls_listing_price'] is not None:
                mls_listing_price = filters['mls_listing_price']
                filter_expression &= Attr('list_price').eq(mls_listing_price)
                filters_provided = True

            if 'address' in filters and filters['address'] is not None and filters['address'] !="":
                filter_address = filters['address'].lower()
                filter_expression &= Attr('location').contains(filter_address)
                filters_provided = True

            if 'house' in filters and filters['house'] is not None and filters['house'] !="":
                filter_house = filters['house'].lower()
                filter_expression &= Attr('location').contains(filter_house)
                filters_provided = True

            if 'street' in filters and filters['street'] is not None and filters['street'] !="":
                filter_street = filters['street'].lower()
                filter_expression &= Attr('location').contains(filter_street)
                filters_provided = True

            if 'city' in filters and filters['city'] is not None and filters['city'] !="":
                filter_city = filters['city'].lower()
                filter_expression &= Attr('location').contains(filter_city)
                filters_provided = True

            if 'state' in filters and filters['state'] is not None and filters['state'] !="":
                filter_state = filters['state'].lower()
                filter_expression &= Attr('location').contains(filter_state)
                filters_provided = True

            if 'county' in filters and filters['county'] is not None and filters['county'] !="":
                filter_county = filters['county'].lower()
                filter_expression &= Attr('location').contains(filter_county)
                filters_provided = True

            if 'zip' in filters and filters['zip'] is not None and filters['zip'] !="":
                filter_zip = filters['zip'].lower()
                filter_expression &= Attr('location').contains(filter_zip)
                filters_provided = True

            if 'absentee_owner' in filters and filters['absentee_owner'] is not None and filters['absentee_owner'] !="":
                filter_absentee_owner = filters['absentee_owner'].lower()
                filter_expression &= Attr('absenteeOwner').eq(filter_absentee_owner)
                filters_provided = True

            if 'adjustable_rate' in filters and filters['adjustable_rate'] is not None and filters['adjustable_rate'] !="":
                filter_adjustable_rate = filters['adjustable_rate'].lower()
                filter_expression &= Attr('adjustableRate').eq(filter_adjustable_rate)
                filters_provided = True

            if 'auction' in filters and filters['auction'] is not None and filters['auction'] !="":
                filter_auction = filters['auction'].lower()
                filter_expression &= Attr('auction').eq(filter_auction)
                filters_provided = True
            
            if 'reo' in filters and filters['reo'] is not None and filters['reo'] !="":
                filter_reo = filters['reo'].lower()
                filter_expression &= Attr('reo').eq(filter_reo)
                filters_provided = True
            
            if 'cash_buyer' in filters and filters['cash_buyer'] is not None and filters['cash_buyer'] !="":
                filter_cash_buyer = filters['cash_buyer'].lower()
                filter_expression &= Attr('cashBuyer').eq(filter_cash_buyer)
                filters_provided = True

            if 'free_clear' in filters and filters['free_clear'] is not None and filters['free_clear'] !="":
                filter_free_clear = filters['free_clear'].lower()
                filter_expression &= Attr('freeClear').eq(filter_free_clear)
                filters_provided = True
            
            if 'high_equity' in filters and filters['high_equity'] is not None and filters['high_equity'] !="":
                filter_high_equity = filters['high_equity'].lower()
                filter_expression &= Attr('highEquity').eq(filter_high_equity)
                filters_provided = True

            if 'negative_equity' in filters and filters['negative_equity'] is not None and filters['negative_equity'] !="":
                filter_negative_equity = filters['negative_equity'].lower()
                filter_expression &= Attr('negativeEquity').eq(filter_negative_equity)
                filters_provided = True

            if 'mls_active' in filters and filters['mls_active'] is not None and filters['mls_active'] !="":
                filter_mls_active = filters['mls_active'].lower()
                filter_expression &= Attr('mlsActive').eq(filter_mls_active)
                filters_provided = True
            
            if 'mls_pending' in filters and filters['mls_pending'] is not None and filters['mls_pending'] !="":
                filter_mls_pending = filters['mls_pending'].lower()
                filter_expression &= Attr('mlsPending').eq(filter_mls_pending)
                filters_provided = True
            
            if 'mls_cancelled' in filters and filters['mls_cancelled'] is not None and filters['mls_cancelled'] !="":
                filter_mls_cancelled = filters['mls_cancelled'].lower()
                filter_expression &= Attr('mlsCancelled').eq(filter_mls_cancelled)
                filters_provided = True
            
            if 'out_of_state_owner' in filters and filters['out_of_state_owner'] is not None and filters['out_of_state_owner'] !="":
                filter_out_of_state_owner = filters['out_of_state_owner'].lower()
                filter_expression &= Attr('outOfStateAbsenteeOwner').eq(filter_out_of_state_owner)
                filters_provided = True

            if 'pre_foreclosure' in filters and filters['pre_foreclosure'] is not None and filters['pre_foreclosure'] !="":
                filter_pre_foreclosure = filters['pre_foreclosure'].lower()
                filter_expression &= Attr('preForeclosure').eq(filter_pre_foreclosure)
                filters_provided = True

            if 'vacant' in filters and filters['vacant'] is not None and filters['vacant'] !="":
                filter_vacant = filters['vacant'].lower()
                filter_expression &= Attr('vacant').eq(filter_vacant)
                filters_provided = True

            if 'baths' in filters and filters['baths'] is not None:
                filter_expression &= Attr('full_baths').eq(filters['baths'])
                filters_provided = True

            if 'beds' in filters and filters['beds'] is not None:
                filter_expression &= Attr('beds').eq(filters['beds'])
                filters_provided = True

            if 'property_type' in filters and filters['property_type'] is not None and filters['property_type'] != "":
                filter_expression &= Attr('propertyType').eq(filters['property_type'])
                filters_provided = True

            if 'private_lender' in filters and filters['private_lender'] is not None and filters['private_lender'] !="":
                filter_private_lender = filters['private_lender'].lower()
                filter_expression &= Attr('privateLender').eq(filter_private_lender)
                filters_provided = True

            if 'estimated_equity_min' in filters and 'estimated_equity_max' in filters and filters['estimated_equity_min'] is not None and filters['estimated_equity_max'] is not None:
                filter_expression &= Attr('estimatedEquity').between(filters['estimated_equity_min'], filters['estimated_equity_max'])
                filters_provided = True

            if 'assessed_value' in filters and filters['assessed_value'] is not None:
                filter_expression &= Attr('assessedValue').eq(filters['assessed_value'])
                filters_provided = True
            
            if 'assessed_land_value_min' in filters and 'assessed_land_value_max' in filters and filters['assessed_land_value_min'] is not None and filters['assessed_land_value_max'] is not None:
                filter_expression &= Attr('assessedLandValue').between(filters['assessed_land_value_min'], filters['assessed_land_value_max'])
                filters_provided = True

            if 'assessed_improvement_value_min' in filters and 'assessed_improvement_value_max' in filters and filters['assessed_improvement_value_min'] is not None and filters['assessed_improvement_value_max'] is not None:
                filter_expression &= Attr('assessedImprovementValue').between(filters['assessed_improvement_value_min'], filters['assessed_improvement_value_max'])
                filters_provided = True

            if not filters_provided:
                return [], 0
            
            response = self.table.scan(
                FilterExpression=filter_expression
            )

            total_properties = len(response['Items'])
            start_idx = (page - 1) * per_page
            end_idx = start_idx + per_page
            properties_list = response['Items'][start_idx:end_idx]
            return properties_list, total_properties
        except Exception as e:
            print(f"An error occurred: {e}")
            return [], 0
        
 
    def save_filter_properties(self, user_id, filters):
        try:
            save_filters = SaveFilters()
            return save_filters.save_filter(user_id, filters)
        except Exception as e:
            print(f"An error occurred: {e}")
            return str(e)
       

    def get_properties_by_ids_with_pagination(self, property_ids, page=1, per_page=50):
        try:
            filter_expression = Attr('id').is_in(property_ids)
            response = self.table.scan(
                FilterExpression=filter_expression
            )
            total_properties = len(response['Items'])
            total_pages = total_properties // per_page + (1 if total_properties % per_page > 0 else 0)
            start_idx = (page - 1) * per_page
            end_idx = start_idx + per_page
            properties_list = response['Items'][start_idx:end_idx]
          
            return properties_list, total_properties, total_pages
        except ClientError as e:
            print(f"Failed to retrieve properties: {e.response['Error']['Message']}")
            return [], 0, 0
        

    def get_property_field_names(self):
        response = self.table.scan(Limit=1)

        if 'Items' in response and response['Items']:
            # Extract the keys (field names) from the first item
            field_names = set(response['Items'][0].keys())
            field_names.discard('id')  # Exclude 'id' if needed
            return list(field_names)
        else:
            return [] 
        

    def get_properties_by_ids(self, property_ids):
        try:
            filter_expression = Attr('id').is_in(property_ids)
            response = self.table.scan(
                FilterExpression=filter_expression
            )
            properties_list = response['Items']

            return properties_list
        except ClientError as e:
            print(f"Failed to retrieve properties: {e.response['Error']['Message']}")
            return []

    def add_file_data_into_db(self, item):
        try:
            # Ensure agent_name is not None
            agent_name = item.get('agent', '') or ''
            
            # Split agent_name only if it's a non-empty string
            if agent_name:
                agent_name_parts = agent_name.split()
                agent_first_name = agent_name_parts[0] if agent_name_parts else ''
                agent_last_name = ' '.join(agent_name_parts[1:]) if len(agent_name_parts) > 1 else ''
            else:
                agent_first_name = ''
                agent_last_name = ''

            # Add agent_first_name and agent_last_name to the item
            item['agent_first_name'] = agent_first_name
            item['agent_last_name'] = agent_last_name
            item['created_at'] = datetime.utcnow().isoformat()
            item['is_property_detail'] = False

            item.pop('agent', None)
            # Insert the item into DynamoDB
            self.table.put_item(Item=item)
        except ClientError as e:
            print(f"Error inserting item: {e}")
            return {'error': str(e)}
        return {'success': True}