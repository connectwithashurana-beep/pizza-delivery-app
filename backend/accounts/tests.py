from django.contrib.auth import get_user_model
from django.test import TestCase
from django.test.utils import override_settings
from django.core import mail
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APIClient
from accounts.models import PasswordResetToken


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


class PasswordResetFlowTest(TestCase):
    @override_settings(
        DEBUG=True,
        EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
        DEFAULT_FROM_EMAIL='noreply@example.com',
        FRONTEND_URL='http://localhost:5173',
    )
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='reset-user',
            email='reset@example.com',
            password='OldPassword123!',
        )
        self.client = APIClient()

    def test_complete_email_reset_flow(self):
        request = self.client.post('/api/auth/forgot-password/', {
            'email': self.user.email,
        }, format='json')
        self.assertEqual(request.status_code, 200, request.content)
        self.assertEqual(len(mail.outbox), 1)
        token = PasswordResetToken.objects.get(user=self.user).token

        reset = self.client.post('/api/auth/reset-password/', {
            'token': str(token),
            'new_password': 'NewPassword123!',
        }, format='json')
        self.assertEqual(reset.status_code, 200, reset.content)
        login = self.client.post('/api/auth/login/', {
            'email': self.user.email,
            'password': 'NewPassword123!',
        }, format='json')
        self.assertEqual(login.status_code, 200, login.content)

    def test_reset_request_rejects_unknown_email(self):
        response = self.client.post('/api/auth/forgot-password/', {
            'email': 'missing@example.com',
        }, format='json')
        self.assertEqual(response.status_code, 404)
        self.assertIn('No account exists', response.data['detail'])

    def test_reset_rejects_weak_password_and_reused_token(self):
        token = PasswordResetToken.objects.create(user=self.user).token
        weak = self.client.post('/api/auth/reset-password/', {
            'token': str(token),
            'new_password': 'short',
        }, format='json')
        self.assertEqual(weak.status_code, 400)
        reset = self.client.post('/api/auth/reset-password/', {
            'token': str(token),
            'new_password': 'NewPassword123!',
        }, format='json')
        self.assertEqual(reset.status_code, 200)
        reused = self.client.post('/api/auth/reset-password/', {
            'token': str(token),
            'new_password': 'AnotherPassword123!',
        }, format='json')
        self.assertEqual(reused.status_code, 400)

    @override_settings(PASSWORD_RESET_TOKEN_EXPIRY_MINUTES=30)
    def test_reset_rejects_expired_token(self):
        token = PasswordResetToken.objects.create(user=self.user)
        PasswordResetToken.objects.filter(pk=token.pk).update(
            created_at=timezone.now() - timedelta(minutes=31),
        )
        response = self.client.post('/api/auth/reset-password/', {
            'token': str(token.token),
            'new_password': 'NewPassword123!',
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['detail'], 'Invalid or expired token.')

    @override_settings(
        DEBUG=True,
        EMAIL_BACKEND='django.core.mail.backends.console.EmailBackend',
        DEFAULT_FROM_EMAIL='noreply@example.com',
        FRONTEND_URL='http://localhost:5173',
    )
    def test_local_console_backend_generates_reset_message(self):
        response = self.client.post('/api/auth/forgot-password/', {
            'email': self.user.email,
        }, format='json')
        self.assertEqual(response.status_code, 200, response.content)
        self.assertTrue(PasswordResetToken.objects.filter(user=self.user).exists())
