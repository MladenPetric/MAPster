import boto3
import json
import os
from boto3.dynamodb.conditions import Key
from .get_artists import lambda_handler as artists_handler
from .get_album import lambda_handler as albums_handler

dynamodb = boto3.resource('dynamodb')
albums_table = dynamodb.Table(os.environ['ALBUMS_TABLE'])
artists_table = dynamodb.Table(os.environ['ARTISTS_TABLE'])

def filter_handler(event, context):
    params = event.get('queryStringParameters') or {}
    genre = params.get('genre')

    if genre:
        #Brzo pretraživanje pomoću partition key-a (Query)
        album_response = albums_table.query(
            KeyConditionExpression=Key('genre').eq(genre)
        )
        artist_response = artists_table.query(
            KeyConditionExpression=Key('genre').eq(genre)
        )

        albums = album_response.get('Items', [])
        artists = artist_response.get('Items', [])

        result = {
            'genre': genre,
            'albums': albums,
            'artists': artists
        }

    else:
        #Ako nema žanra – samo pozovemo postojeći get_all_handler
        albums_data = albums_handler(event, context)
        artists_data = artists_handler(event, context)
        #get_all_handler vraća kompletan HTTP odgovor, pa parsiramo body
        albums_body = json.loads(albums_data['body'])
        artists_body = json.loads(artists_data['body'])
        result = {
            'genre': 'all',
            'albums': albums_body.get('albums', []),
            'artists': artists_body.get('artists', [])
        }

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(result)
    }
