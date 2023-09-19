from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser


class CustomUserCreationForm(UserCreationForm):

    # Поле для email с проверкой на уникальность
    email = forms.EmailField(
        max_length=256,
        help_text='Required. Enter a valid email address.',
        widget=forms.EmailInput(attrs={'class': 'form-control'}),
    )

    # Поле для username с проверкой на уникальность
    username = forms.CharField(
        max_length=64,
        help_text='Required. 64 characters or fewer. Letters, digits and @/./+/-/_ only.',
        widget=forms.TextInput(attrs={'class': 'form-control'}),
    )

    password2 = forms.CharField(
        label="Password confirmation",
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
        help_text="Enter the same password as above, for verification.",
        required=True  # Указываем, что это поле обязательное
    )

    class Meta(UserCreationForm.Meta):
        model = CustomUser

    def clean_password2(self):
        # Проверяем, что оба пароля совпадают
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords do not match.")
        return password2

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if CustomUser.objects.filter(email=email).exists():
            raise forms.ValidationError('This email is already in use.')
        return email

    def clean_username(self):
        username = self.cleaned_data.get('username')
        # if CustomUser.objects.filter(username=username).exists():
        #     raise forms.ValidationError('This user is already registered')
        return username

