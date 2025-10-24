import boto3
import os
import json
from boto3.dynamodb.conditions import Attr  
dynamodb = boto3.resource('dynamodb')
artists_table = dynamodb.Table(os.environ['ARTISTS_TABLE'])

def lambda_handler(event, context):
    artist_id = event['pathParameters'].get('artistId')

    try:
        response = artists_table.scan(
            FilterExpression=Attr('artistId').eq(artist_id)
        )

        items = response.get('Items', [])

        if not items:
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Artist not found'})
            }

        artist = items[0]

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(artist)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
