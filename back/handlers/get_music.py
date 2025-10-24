import boto3
import json
import os

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

MUSIC_BUCKET = os.environ['MUSIC_BUCKET']
FILES_TABLE = os.environ['MUSIC_FILES_TABLE']
META_TABLE = os.environ['MUSIC_META_TABLE']

files_table = dynamodb.Table(FILES_TABLE)
meta_table = dynamodb.Table(META_TABLE)


def lambda_handler(event, context):
    try:
        # 1️⃣ Dobavi sve metapodatke pesama
        meta_response = meta_table.scan()
        meta_items = meta_response.get('Items', [])

        all_music = []

        for meta_item in meta_items:
            music_id = meta_item['musicId']

            # 2️⃣ Dobavi fajl info
            file_resp = files_table.get_item(Key={'musicId': music_id})
            file_item = file_resp.get('Item')
            if not file_item:
                continue  # preskoči ako nema fajla

            # 3️⃣ Generiši pre-signed URL
            presigned_url = s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': MUSIC_BUCKET, 'Key': file_item['s3Key']},
                ExpiresIn=3600
            )

            all_music.append({
                'musicId': music_id,
                'title': meta_item.get('title'),
                'artist': meta_item.get('artist'),
                'album': meta_item.get('album'),
                'genre': meta_item.get('genre'),
                'filename': file_item.get('filename'),
                'contentType': file_item.get('contentType'),
                'url': presigned_url
            })

        return response(200, all_music)

    except Exception as e:
        print(f"Error fetching all music: {e}")
        return response(500, {"message": str(e)})


def response(status_code, body):
    return {
        'statusCode': status_code,
        'body': json.dumps(body)
    }
