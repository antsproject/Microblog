import requests
import os


class UsersMicroservice:
    __slots__ = []

    @staticmethod
    def send_get_users(ids: list):
        payload = {"id_list": ",".join(ids)}
        address = os.environ["USERS_MICROSERVICE_URL"]
        return requests.get(f"{address}/api/users/", params=payload).json()

    @staticmethod
    def get_users(posts):
        if isinstance(posts, dict) and posts["user_id"]:
            user_data = UsersMicroservice.send_get_users([str(posts["user_id"])])
            posts['user'] = user_data['results'][0]
            return posts
        return posts
