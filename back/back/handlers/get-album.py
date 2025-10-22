import boto3
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['ALBUMS_TABLE'])

def get_albums(event, context):
    try:
        response = table.scan()
        items = response.get('Items', [])
        return {
            "statusCode": 200,
            "body": str(items)
        }
    except Exception as e:
        return {"statusCode": 500, "body": str(e)}