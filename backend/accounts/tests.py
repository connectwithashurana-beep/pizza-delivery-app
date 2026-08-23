from django.contrib.auth import get_user_model
from django.test import TestCase
from django.test.utils import override_settings
from django.core import mail
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


class ContactViewTest(TestCase):
    @override_settings(
        EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
        ADMIN_EMAIL='support@example.com',
        DEFAULT_FROM_EMAIL='noreply@example.com',
    )
    def test_contact_sends_support_email(self):
        response = APIClient().post('/api/auth/contact/', {
            'name': 'Test User',
            'email': 'visitor@example.com',
            'phone': '9999999999',
            'message': 'I have a question about delivery.',
        }, format='json')

        self.assertEqual(response.status_code, 200, response.content)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ['support@example.com'])
        self.assertIn('I have a question', mail.outbox[0].body)

    def test_contact_rejects_invalid_email(self):
        response = APIClient().post('/api/auth/contact/', {
            'name': 'Test User',
            'email': 'not-an-email',
            'message': 'Hello',
        }, format='json')

        self.assertEqual(response.status_code, 400)


class HealthCheckTest(TestCase):
    def test_health_check_is_public(self):
        response = APIClient().get('/health/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 'ok'})
