import json
import os
import uuid
import datetime
import boto3

dynamodb = boto3.resource('dynamodb')
# Pretpostavimo da je tabela za albume konfigurisana
ALBUM_TABLE = os.environ.get('ALBUMS_TABLE', 'MusicAlbums')

def lambda_handler(event, context):
    try:
        # Parsi telo zahteva iz API Gatewaya
        body = json.loads(event['body'])
        name = body.get('name')
        genre = body.get('genre')
        
        if not name or not genre:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Missing name or genre in request body'})
            }

        album_id = str(uuid.uuid4())
        
        table = dynamodb.Table(ALBUM_TABLE)
        
        # Kreiranje novog albuma u DynamoDB
        album_item = {
            'albumId': album_id,
            'name': name,
            'genre': genre,
        }
        
        table.put_item(Item=album_item)
        
        # Vraćanje novog albuma, prilagođenog modelu GetAlbum
        return {
            'statusCode': 200,
            'body': json.dumps({
                'id': album_id, # Koristimo 'id' da bi se podudaralo sa Angular logikom
                'name': name,
                'genre': genre
            })
        }

    except Exception as e:
        print(f"Error creating album: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': f'Internal server error: {str(e)}'})
        }