from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# --- Configuración de la URL de la Base de Datos ---
# Usaremos SQLite para el desarrollo local. El archivo se creará en el directorio raíz del backend.
SQLALCHEMY_DATABASE_URL = "sqlite:///./gmd_database.db"

# En un entorno de producción, podrías cambiar a PostgreSQL:
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgresserver/db"

# --- Creación del Motor de SQLAlchemy ---
# El argumento `connect_args` es necesario solo para SQLite para permitir que se use en múltiples hilos (como en FastAPI).
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# --- Creación de la Sesión de la Base de Datos ---
# Cada instancia de SessionLocal será una sesión de base de datos. La clase en sí aún no es una sesión.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- Base Declarativa ---
# Usaremos esta clase Base para crear cada uno de los modelos de la base de datos (ORM models).
Base = declarative_base()
