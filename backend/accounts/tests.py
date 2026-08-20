from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient


class RegistrationWithoutUsernameTest(TestCase):
    def test_register_without_username_works_and_generates_one(self):
        client = APIClient()
        payload = {
            'email': 'newuserwithoutusername@example.com',
            'password': 'StrongPass123!',
            'confirmPassword': 'StrongPass123!',
            'phone': '9999999999',
            'address': 'Test address',
        }

        response = client.post('/api/auth/register/', payload, format='json')

        self.assertEqual(response.status_code, 201, response.content)
        self.assertIn('message', response.data)
        self.assertTrue(get_user_model().objects.filter(email='newuserwithoutusername@example.com').exists())
