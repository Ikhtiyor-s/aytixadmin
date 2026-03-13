"""
Admin foydalanuvchi yaratish skripti
Ishga tushirish: python create_admin.py
"""
from app.core.database import SessionLocal
from app.models import User, UserRole
from app.core.security import get_password_hash

def create_admin():
    db = SessionLocal()

    try:
        # Admin mavjudligini tekshirish
        existing_admin = db.query(User).filter(User.username == "admin").first()

        if existing_admin:
            print(f"Admin allaqachon mavjud: {existing_admin.username}")
            print(f"Role: {existing_admin.role}")

            # Agar admin emas bo'lsa, admin qilish
            if existing_admin.role != UserRole.ADMIN:
                existing_admin.role = UserRole.ADMIN
                db.commit()
                print("Admin roli yangilandi!")
            return

        # Yangi admin yaratish
        admin_user = User(
            phone="+998900000000",
            username="admin",
            hashed_password=get_password_hash("Admin123!"),
            full_name="Admin User",
            first_name="Admin",
            last_name="User",
            email="admin@aytix.uz",
            role=UserRole.ADMIN,
            is_active=True
        )

        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print("=" * 50)
        print("Admin foydalanuvchi yaratildi!")
        print("=" * 50)
        print(f"Username: admin")
        print(f"Password: Admin123!")
        print(f"Role: {admin_user.role}")
        print("=" * 50)

    except Exception as e:
        print(f"Xatolik: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
