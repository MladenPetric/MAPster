import json
import boto3
import os
from uuid import uuid4

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['ARTISTS_TABLE']
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        name = body.get('name')
        biography = body.get('biography')
        genres = body.get('genres', [])

        if not name or not biography:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Name and biography are required'})
            }

        artist_id = str(uuid4())
        item = {
            'artistId': artist_id,
            'name': name,
            'biography': biography,
            'genres': genres
        }

        table.put_item(Item=item)

        return {
            'statusCode': 201,
            'body': json.dumps({'message': 'Artist created', 'artist': item})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }