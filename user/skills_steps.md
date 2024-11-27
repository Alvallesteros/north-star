# Creating a Basic CRUD for Skills using MongoDB, PyMongo, and Django REST Framework

## Prerequisites
- Ensure MongoDB is installed and running.
- Install necessary packages:
    ```bash
    pip install pymongo djangorestframework
    ```

## Step 1: Configure MongoDB Connection
Edit your Django settings to include MongoDB connection details.

```python
# settings.py
import pymongo

MONGO_CLIENT = pymongo.MongoClient("mongodb://localhost:27017/")
MONGO_DB = MONGO_CLIENT["northstar"]
MONGO_COLLECTION = MONGO_DB["skills"]
```

## Step 2: Create the Skill Model
Since we are using MongoDB directly, we won't use Django's ORM. Instead, we'll define a Python class to represent the Skill model.

```python
# models.py
from bson import ObjectId

class Skill:
        def __init__(self, name, description, careers, difficulty, courses):
                self._id = ObjectId()
                self.name = name
                self.description = description
                self.careers = careers
                self.difficulty = difficulty
                self.courses = courses
```

## Step 3: Create Serializers
Create serializers to handle JSON conversion.

```python
# serializers.py
from rest_framework import serializers

class SkillSerializer(serializers.Serializer):
        _id = serializers.CharField(read_only=True)
        name = serializers.CharField(max_length=100)
        description = serializers.CharField(max_length=500)
        careers = serializers.ListField(child=serializers.CharField())
        difficulty = serializers.CharField(max_length=50)
        courses = serializers.ListField(child=serializers.CharField())
```

## Step 4: Create Views
Create views to handle CRUD operations.

```python
# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SkillSerializer
from django.conf import settings

class SkillList(APIView):
        def get(self, request):
                skills = list(settings.MONGO_CLIENT.)
                for skill in skills:
                        skill['_id'] = str(skill['_id'])
                return Response(skills)

        def post(self, request):
                serializer = SkillSerializer(data=request.data)
                if serializer.is_valid():
                        skill = serializer.data
                        skill['_id'] = ObjectId()
                        settings.MONGO_COLLECTION.insert_one(skill)
                        return Response(skill, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SkillDetail(APIView):
        def get(self, request, pk):
                skill = settings.MONGO_COLLECTION.find_one({"_id": ObjectId(pk)})
                if skill:
                        skill['_id'] = str(skill['_id'])
                        return Response(skill)
                return Response(status=status.HTTP_404_NOT_FOUND)

        def put(self, request, pk):
                serializer = SkillSerializer(data=request.data)
                if serializer.is_valid():
                        settings.MONGO_COLLECTION.update_one(
                                {"_id": ObjectId(pk)},
                                {"$set": serializer.data}
                        )
                        return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        def delete(self, request, pk):
                settings.MONGO_COLLECTION.delete_one({"_id": ObjectId(pk)})
                return Response(status=status.HTTP_204_NO_CONTENT)
```

## Step 5: Configure URLs
Add URL patterns to route requests to the views.

```python
# urls.py
from django.urls import path
from .views import SkillList, SkillDetail

urlpatterns = [
        path('skills/', SkillList.as_view(), name='skill-list'),
        path('skills/<str:pk>/', SkillDetail.as_view(), name='skill-detail'),
]
```

## Step 6: Test the API
Run the Django server and test the API endpoints using tools like Postman or curl.

```bash
python manage.py runserver
```

- Test GET, POST on `/skills/`
- Test GET, PUT, DELETE on `/skills/<id>/`

This setup provides a basic CRUD interface for managing skills using MongoDB with Django REST Framework.

## Step 7: Create the Frontend

### Step 7.1: Create HTML Templates
Create HTML templates to render the frontend. Place these files in a `templates` directory within your Django app.

- `templates/index.html`: Main page to list and add skills.
- `templates/detail.html`: Page to view, edit, and delete a specific skill.

### Step 7.2: Create CSS Files
Create CSS files to style the frontend. Place these files in a `static/css` directory within your Django app.

- `static/css/styles.css`: Main stylesheet for the application.

### Step 7.3: Create JavaScript Files
Create JavaScript files to handle frontend logic and API interactions. Place these files in a `static/js` directory within your Django app.

- `static/js/main.js`: Main JavaScript file to handle CRUD operations and DOM manipulation.

### Step 7.4: Configure Django to Serve Static Files
Ensure your Django settings are configured to serve static files. Add the following settings in `settings.py`:

```python
# settings.py
import os

STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]
```

### Step 7.5: Update Views to Render Templates
Update your Django views to render the HTML templates. Modify `views.py` to include the following:

```python
# views.py
from django.shortcuts import render

def index(request):
        return render(request, 'index.html')

def detail(request, pk):
        return render(request, 'detail.html', {'pk': pk})
```

### Step 7.6: Update URLs to Include Frontend Routes
Update your URL patterns to include routes for the frontend. Modify `urls.py` to include the following:

```python
# urls.py
from django.urls import path
from .views import SkillList, SkillDetail, index, detail

urlpatterns = [
        path('', index, name='index'),
        path('skills/', SkillList.as_view(), name='skill-list'),
        path('skills/<str:pk>/', SkillDetail.as_view(), name='skill-detail'),
        path('skills/detail/<str:pk>/', detail, name='detail'),
]
```

### Step 7.7: Test the Frontend
Run the Django server and navigate to the root URL to test the frontend.

```bash
python manage.py runserver
```

- Test the main page at `/` to list and add skills.
- Test the detail page at `/skills/detail/<id>/` to view, edit, and delete a specific skill.

This setup provides a basic frontend interface for managing skills using HTML, CSS, and JavaScript with Django.