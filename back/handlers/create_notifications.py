import boto3
import json
import os
import uuid

dynamodb = boto3.resource('dynamodb')
subscriptions_table = dynamodb.Table(os.environ['SUBSCRIPTIONS_TABLE'])
notifications_table = dynamodb.Table(os.environ['NOTIFICATIONS_TABLE'])

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        event_type = body.get('type')  # "songAdd", "artistAdd", "artistSongAdd"
        target_id = body.get('targetId')  # id umetnika ili naziv žanra

        if not event_type or not target_id:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "Missing type or targetId"})
            }

        # Dohvati sve pretplaćene korisnike na taj target
        response = subscriptions_table.scan()
        all_subs = response.get('Items', [])
        subscribers = [s for s in all_subs if s['targetId'] == target_id]

        # Formiraj poruku u zavisnosti od tipa
        if event_type == "songAdd":
            message = f"Dodata je nova pesma za tvoj žanr!"
        elif event_type == "artistAdd":
            message = f"Dodat je novi umetnik za tvoj žanr!"
        elif event_type == "artistSongAdd":
            message = f"Dodata je nova pesma od umetnika kojeg pratiš!"
        else:
            message = f"Nova notifikacija!"

        # Upisi notifikacije za svakog korisnika
        for sub in subscribers:
            notifications_table.put_item(Item={
                'userId': sub['userId'],
                'notificationId': str(uuid.uuid4()),
                'message': message,
                'type': event_type
            })

        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"message": f"Notifications created for {len(subscribers)} users"})
        }

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
