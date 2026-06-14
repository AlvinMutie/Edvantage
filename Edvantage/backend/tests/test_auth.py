import json

def test_register(client):
    """Test user registration"""
    data = {
        'full_name': 'Test User',
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'password123',
        'role': 'student'
    }
    response = client.post('/api/auth/register', json=data)
    if response.status_code != 201:
        print(response.get_json())
    assert response.status_code == 201
    assert response.get_json()['msg'] == 'User created successfully'

def test_login(client):
    """Test user login"""
    # First register a user
    client.post('/api/auth/register', json={
        'full_name': 'Login User',
        'username': 'loginuser',
        'email': 'login@example.com',
        'password': 'password123',
        'role': 'student'
    })
    
    # Then login
    response = client.post('/api/auth/login', json={
        'username': 'loginuser',
        'password': 'password123'
    })
    assert response.status_code == 200
    assert 'access_token' in response.get_json()
    assert response.get_json()['role'] == 'student'

def test_login_invalid(client):
    """Test login with invalid credentials"""
    response = client.post('/api/auth/login', json={
        'username': 'nonexistent',
        'password': 'wrongpassword'
    })
    assert response.status_code == 401
    assert response.get_json()['msg'] == 'Bad username or password'
