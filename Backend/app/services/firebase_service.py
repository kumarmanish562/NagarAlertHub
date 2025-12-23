import firebase_admin
from firebase_admin import credentials, db
from app.core.config import settings
import json
import os

class FirebaseService:
    def __init__(self):
        if not firebase_admin._apps:
            try:
                if os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
                    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                    firebase_admin.initialize_app(cred, {
                        'databaseURL': settings.FIREBASE_DATABASE_URL
                    })
                    self.db = db
                    print("Firebase Admin Initialized")
                else:
                    self.db = None
            except Exception as e:
                print(f"Error initializing Firebase: {e}")
                self.db = None
        else:
            self.db = db

    # --- USER & LOCATION ---
    def save_user(self, user_data: dict, user_id: str = None):
        if not self.db: return {"error": "Firebase inactive"}
        try:
            ref = self.db.reference('users')
            if user_id:
                user_ref = ref.child(user_id)
                user_data['updatedAt'] = {".sv": "timestamp"}
                user_ref.update(user_data)
                return {"success": True, "id": user_id}
            else:
                new_ref = ref.push()
                user_data['createdAt'] = {".sv": "timestamp"}
                new_ref.set(user_data)
                return {"success": True, "id": new_ref.key}
        except Exception as e:
            return {"error": str(e)}

    def get_users(self):
        if not self.db: return {}
        return self.db.reference('users').get() or {}

    # --- REPORTS (Table 1) ---
    def save_report(self, report_data: dict):
        if not self.db: return {"error": "Firebase inactive"}
        try:
            ref = self.db.reference('reports')
            new_ref = ref.push()
            report_data['id'] = new_ref.key
            report_data['timestamp'] = {".sv": "timestamp"}
            new_ref.set(report_data)
            return {"success": True, "id": new_ref.key}
        except Exception as e:
            return {"error": str(e)}

    def get_reports(self):
        if not self.db: return {}
        return self.db.reference('reports').get() or {}

    def update_report_status(self, report_id: str, status: str):
        if not self.db: return {"error": "Firebase inactive"}
        try:
            self.db.reference(f'reports/{report_id}').update({"status": status})
            return {"success": True}
        except Exception as e:
            return {"error": str(e)}

    # --- SOLUTIONS (Table 2) ---
    def save_solution(self, solution_data: dict):
        """
        Saves data to the 'solutions' table and updates the report status.
        """
        if not self.db: return {"error": "Firebase inactive"}
        try:
            # 1. Save to Solutions Table
            sol_ref = self.db.reference('solutions')
            new_sol_ref = sol_ref.push()
            solution_data['id'] = new_sol_ref.key
            solution_data['solvedAt'] = {".sv": "timestamp"}
            new_sol_ref.set(solution_data)

            # 2. Update Report Status to 'Resolved'
            report_id = solution_data.get('reportId')
            if report_id:
                self.db.reference(f'reports/{report_id}').update({
                    "status": "Resolved",
                    "solutionId": new_sol_ref.key
                })

            return {"success": True, "solutionId": new_sol_ref.key}
        except Exception as e:
            return {"error": str(e)}

    def get_solutions(self):
        if not self.db: return {}
        return self.db.reference('solutions').get() or {}

firebase_service = FirebaseService()