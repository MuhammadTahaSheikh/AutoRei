
**HomeHarvest** is a real estate scraping library that extracts and formats data in the style of MLS listings.

## HomeHarvest Features

- **Source**: Fetches properties directly from **Realtor.com**.
- **Data Format**: Structures data to resemble MLS listings.

## Installation

```bash
pip install -U homeharvest
```
  _Python version >= [3.9](https://www.python.org/downloads/release/python-3100/) required_

### Parameters for `scrape_property()`
```
Required
├── location (str): The address in various formats - this could be just a zip code, a full address, or city/state, etc.
└── listing_type (option): Choose the type of listing.
    - 'for_rent'
    - 'for_sale'
    - 'sold'
    - 'pending'

Optional
├── radius (decimal): Radius in miles to find comparable properties based on individual addresses.
│    Example: 5.5 (fetches properties within a 5.5-mile radius if location is set to a specific address; otherwise, ignored)
│
├── past_days (integer): Number of past days to filter properties. Utilizes 'last_sold_date' for 'sold' listing types, and 'list_date' for others (for_rent, for_sale).
│    Example: 30 (fetches properties listed/sold in the last 30 days)
│
├── date_from, date_to (string): Start and end dates to filter properties listed or sold, both dates are required.
|    (use this to get properties in chunks as there's a 10k result limit)
│    Format for both must be "YYYY-MM-DD".
│    Example: "2023-05-01", "2023-05-15" (fetches properties listed/sold between these dates)
│
├── mls_only (True/False): If set, fetches only MLS listings (mainly applicable to 'sold' listings)
│
├── foreclosure (True/False): If set, fetches only foreclosures
│
└── proxy (string): In format 'http://user:pass@host:port'
│
└── extra_property_data (bool): Increases requests by O(n). If set, this fetches additional property data (e.g. agent, broker, property evaluations etc.)
```

### Property Schema
```plaintext
Property
├── Basic Information:
│ ├── property_url
│ ├── mls
│ ├── mls_id
│ └── status

├── Address Details:
│ ├── street
│ ├── unit
│ ├── city
│ ├── state
│ └── zip_code

├── Property Description:
│ ├── style
│ ├── beds
│ ├── full_baths
│ ├── half_baths
│ ├── sqft
│ ├── year_built
│ ├── stories
│ └── lot_sqft

├── Property Listing Details:
│ ├── days_on_mls
│ ├── list_price
│ ├── list_date
│ ├── pending_date
│ ├── sold_price
│ ├── last_sold_date
│ ├── price_per_sqft
│ ├── parking_garage
│ └── hoa_fee

├── Location Details:
│ ├── latitude
│ ├── longitude
│ ├── nearby_schools


├── Agent Info:
│ ├── agent
│ ├── agent_email
│ └── agent_phone
```

### Exceptions
The following exceptions may be raised when using HomeHarvest:

- `InvalidListingType` - valid options: `for_sale`, `for_rent`, `sold`
- `InvalidDate` - date_from or date_to is not in the format YYYY-MM-DD.
- `AuthenticationError` - Realtor.com token request failed.
