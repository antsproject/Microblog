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
    def get_users(comments):
        if isinstance(comments, dict) and comments["user_id"]:
            user_data = UsersMicroservice.send_get_users([str(comments["user_id"])])
            comments["user"] = user_data["results"][0]
            return comments
        elif isinstance(comments, list):
            collected_ids = [str(_["user_id"]) for _ in comments]
            users = UsersMicroservice.comfort_list(
                UsersMicroservice.send_get_users(collected_ids)
            )
            for idx, post in enumerate(comments):
                comments[idx]["user"] = (
                    users[post["user_id"]] if post["user_id"] in users else None
                )
        return comments
