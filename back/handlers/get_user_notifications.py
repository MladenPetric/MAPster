import boto3
import json
import os

dynamodb = boto3.resource('dynamodb')
notifications_table = dynamodb.Table(os.environ['NOTIFICATIONS_TABLE'])

def lambda_handler(event, context):
    try:
        user_id = event['pathParameters']['userId']

        response = notifications_table.query(
            KeyConditionExpression="userId = :uid",
            ExpressionAttributeValues={":uid": user_id}
        )

        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps(response.get('Items', []))
        }

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}