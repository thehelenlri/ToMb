const form = document.getElementById('form');
const firstname_input = document.getElementById('firstname-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const repeat_password_input = document.getElementById('repeat-password-input');
const error_message = document.getElementById('error-message');

// فرم ارسال و اعتبارسنجی
form.addEventListener('submit', (e) => {
    e.preventDefault();  // جلوگیری از ارسال فرم

    let errors = [];
    if (firstname_input) {
        // اگر فرم ثبت‌نام است
        errors = getSignupFormErrors(
            firstname_input.value,
            email_input.value,
            password_input.value,
            repeat_password_input.value
        );
    } else {
        // اگر فرم لاگین است
        errors = getLoginFormErrors(email_input.value, password_input.value);

        // بررسی تطابق ایمیل و پسورد
        const storedUserData = localStorage.getItem(email_input.value);
        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            if (userData.password !== password_input.value) {
                errors.push('Invalid email or password.');
            }
        } else {
            errors.push('Invalid email or password.');
        }
    }

    if (errors.length > 0) {
        error_message.innerText = errors.join(". ");
    } else {
        if (firstname_input) {
            // ثبت‌نام: ذخیره اطلاعات کاربر در localStorage
            const userData = {
                email: email_input.value,
                password: password_input.value
            };
            localStorage.setItem(email_input.value, JSON.stringify(userData));
            window.location.href = 'todo.html'; // هدایت به صفحه tomb.html بعد از ثبت‌نام
        } else {
            // ورود: ذخیره وضعیت لاگین در localStorage
            localStorage.setItem('loggedIn', email_input.value);
            window.location.href = 'todo.html'; // هدایت به صفحه tomb.html بعد از ورود
        }
    }
});

// فرم ثبت‌نام اعتبارسنجی
function getSignupFormErrors(firstname, email, password, repeatPassword) {
    let errors = [];

    // اعتبارسنجی نام
    if (firstname === '' || firstname == null) {
        errors.push('First name is required.');
    }

    // اعتبارسنجی ایمیل
    if (email === '' || email == null) {
        errors.push('Email is required.');
    }

    // اعتبارسنجی پسورد
    if (password === '' || password == null) {
        errors.push('Password is required.');
    }
    if (password.length < 8) {
        errors.push('Password must have at least 8 characters.');
    }

    // اعتبارسنجی تطابق پسورد
    if (password !== repeatPassword) {
        errors.push('Passwords do not match.');
    }

    return errors;
}

// فرم لاگین اعتبارسنجی
function getLoginFormErrors(email, password) {
    let errors = [];

    // اعتبارسنجی ایمیل
    if (email === '' || email == null) {
        errors.push('Email is required.');
    }

    // اعتبارسنجی پسورد
    if (password === '' || password == null) {
        errors.push('Password is required.');
    }

    return errors;
}

// حذف پیام خطا هنگام تایپ کردن
const allInputs = [firstname_input, email_input, password_input, repeat_password_input].filter(input => input != null);
allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (error_message.innerText) {
            error_message.innerText = '';  // پاک کردن پیام خطا هنگام تایپ کردن
        }
    });
});
