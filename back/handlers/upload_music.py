import boto3
import json
import os
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['MUSIC_META_TABLE']
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
    except:
        return {"statusCode": 400, "body": json.dumps({"message": "Invalid JSON body"})}

    music_id = body.get('musicId') 

    if not music_id:
        return {"statusCode": 400, "body": json.dumps({"message": "musicId is missing"})}

    table.put_item(Item={
        'musicId': music_id,
        'title': body['title'],
        'artist': body['artist'],
        'album': body['album'],
        'genre': body['genre'],
        'createdAt': datetime.utcnow().isoformat()
    })

    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Metadata saved successfully", "musicId": music_id}),
        "headers": {"Access-Control-Allow-Origin": "*"}
    }

