import boto3
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import NoCredentialsError, PartialCredentialsError, ClientError
import uuid
import datetime
# Initialize AWS DynamoDB with credentials
boto3.setup_default_session(
    aws_access_key_id='',
    aws_secret_access_key='',
    region_name=''
)

# def update_existing_records():
#     try:
#         dynamodb = boto3.resource('dynamodb')
#         table = dynamodb.Table('users')

#         response = table.scan()
#         items = response['Items']
        
#         updated_count = 0

#         for item in items:
#             if 'phone' not in item or item['phone'] is not None:
#                 table.update_item(
#                     Key={'id': item['id']},
#                     UpdateExpression="SET #phone = :null",
#                     ExpressionAttributeNames={
#                         "#phone": "phone"
#                     },
#                     ExpressionAttributeValues={
#                         ":null": None
#                     }
#                 )
#                 updated_count += 1

#         print(f"Successfully updated {updated_count} items.")
    
#     except NoCredentialsError:
#         print("Error: AWS credentials not found.")
#     except PartialCredentialsError:
#         print("Error: Incomplete AWS credentials.")
#     except ClientError as e:
#         print(f"ClientError: {e.response['Error']['Message']}")
#     except Exception as e:
#         print(f"An unexpected error occurred: {str(e)}")


def update_existing_records():
    try:
        dynamodb = boto3.resource('dynamodb')
        notifications_table = dynamodb.Table('notifications')

        # Scan all records from the notifications table
        response = notifications_table.scan()
        notifications = response['Items']

        # Iterate over all notifications and insert or update the test_mode field
        for notification in notifications:
            user_id = notification['user_id']
            notification_id = notification['id']
            print(f"Processing notification for user_id: {user_id}")

            # Check if 'test_mode' exists and set it to False if missing or needs update
            if 'test_mode' not in notification or notification['test_mode'] != False:
                try:
                    # Update or add the 'test_mode' field
                    notifications_table.update_item(
                        Key={'id': notification_id},
                        UpdateExpression="set test_mode = :val",
                        ExpressionAttributeValues={':val': False},
                        ReturnValues="UPDATED_NEW"
                    )
                    print(f"Updated 'test_mode' for user_id: {user_id}, notification_id: {notification_id}")
                except ClientError as e:
                    print(f"Failed to update notification for user_id: {user_id}, Error: {e.response['Error']['Message']}")

    except NoCredentialsError:
        print("Error: AWS credentials not found.")
    except PartialCredentialsError:
        print("Error: Incomplete AWS credentials.")
    except ClientError as e:
        print(f"ClientError: {e.response['Error']['Message']}")
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    update_existing_records()