import boto3
import json
import os
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
subscriptions_table = dynamodb.Table(os.environ['SUBSCRIPTIONS_TABLE'])

def lambda_handler(event, context):
  
    try:
        body = json.loads(event['body'])
        user_id = body.get('userId')
        sub_type = body.get('type')  # "artist" ili "genre"
        target_id = body.get('targetId')  # artistId ili genre string
      
        print("Parsed body:", body)
        if not user_id or not sub_type or not target_id:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "Missing userId, type or targetId"})
            }
    
        subscriptions_table.put_item(Item={
            'userId': user_id,
            'targetId': target_id,
            'type': sub_type,
            'createdAt': datetime.utcnow().isoformat()
        })

        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"message": f"User {user_id} subscribed to {target_id} ({sub_type})"})
        }

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}