import requests
import os


class UsersMicroservice:
    __slots__ = []

    @staticmethod
    def send_get_users(ids: list):
        payload = {"id_list": ",".join(ids)}
        address = os.getenv("USERS_MICROSERVICE_URL")
        return requests.get(f"{address}api/users/", params=payload).json()

    @staticmethod
    def comfort_list(users):
        if users and users["results"]:
            users = {_["id"]: _ for _ in users["results"]}
            return users
        return {}

    @staticmethod
    def get_users(posts):
        if isinstance(posts, dict) and posts["user_id"]:
            user_data = UsersMicroservice.send_get_users([str(posts["user_id"])])
            posts["user"] = user_data["results"][0]
            return posts
        elif isinstance(posts, list):
            collected_ids = [str(_["user_id"]) for _ in posts]
            users = UsersMicroservice.comfort_list(
                UsersMicroservice.send_get_users(collected_ids)
            )
            for idx, post in enumerate(posts):
                posts[idx]["user"] = (
                    users[post["user_id"]] if post["user_id"] in users else None
                )
        return posts
