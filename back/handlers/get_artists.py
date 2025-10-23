import boto3
import os
import json
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['ARTISTS_TABLE'])

def lambda_handler(event, context):
    try:
        response = table.scan()
        items = response.get('Items', [])
        return {
            "statusCode": 200,
            "body": json.dumps(items)
        }
    except Exception as e:
        return {"statusCode": 500, "body": str(e)}