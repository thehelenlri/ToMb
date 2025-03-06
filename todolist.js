function showDivisionsWithDelay() {
    const cardDivisions = document.querySelectorAll(".card");
    const delay = 300;

    cardDivisions.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = 1;
        }, (index + 1) * delay);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('duedate').valueAsDate = new Date();
    const taskContainer = document.getElementById("TaskContainer");
    const addButton = document.querySelector(".bx-plus");
    const textInput = document.getElementById("todo");
    const dateInput = document.getElementById("duedate");
    const myDayLink = document.getElementById("o1");
    const thisWeekLink = document.getElementById("o2");
    const thisMonthLink = document.getElementById("o3");
    const otherLink = document.getElementById("o4");
    const titleLink = document.getElementById("header_title");

    // const taskList = document.getElementById("taskList");

    // تابعی برای تولید یک شناسه عددی منحصر به فرد
    const generateNumericID = () => {
        return Date.now() + Math.floor(Math.random() * 1000);
    };

            // تابعی برای مدیریت ارسال داده‌ها

    const saveData = () => {
        const taskDescription = textInput.value;
        const dueDate = dateInput.value;

        // بررسی کنید که آیا متن و تاریخ هر دو قبل از ذخیره وارد شده‌اند
        if (taskDescription.trim() === "" || dueDate === "") {
            swal({
                title: "نه نه نه نه",
                text: "لطفا هم وظیفه و هم تاریخ سررسید را وارد کنید!",
                icon: "error",
            });
        } else {
            // تولید یک شناسه عددی منحصر به فرد
            const id = generateNumericID();

            // ایجاد یک شیء جدید که نمایانگر کار مورد نظر است
            const task = {
                id: id,
                text: taskDescription,
                date: dueDate,
                completed: false,
                timestamp: Date.now(), // برچسب زمانی کوتاه‌شده به میلی‌ثانیه

            };

            // تبدیل شیء تسک به یک رشته JSON
            const taskData = JSON.stringify(task);

            // ذخیره داده‌های JSON در LocalStorage با استفاده از شناسه منحصر به فرد به عنوان کلید
            localStorage.setItem(id, taskData);

            // پاک کردن ورودی‌های متن و تاریخ پس از ذخیره
            textInput.value = "";
            dateInput.value = "";
            displayTasks(currentSection);
        }
    };

    addButton.addEventListener("click", saveData);

// اضافه کردن شنونده رویداد keypress به ورودی متن و ورودی تاریخ
    textInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            saveData();
        }
    });

    dateInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            saveData();
        }
    });

    // تابعی برای بررسی اینکه آیا تاریخ امروز است یا خیر
    const isToday = (dateString) => {
        const today = new Date();
        const date = new Date(dateString);
        return date.toDateString() === today.toDateString();
    };
    // تابعی برای دریافت تسک‌ها از LocalStorage و نمایش آن‌ها
    const displayTasks = (section, tasksToDisplay) => {
        currentSection = section;
        const tasks = Object.entries(localStorage)
            .filter(([key]) => key !== "userPreferences")
            .map(([, tasks]) => JSON.parse(tasks));
        const tasksToRender = tasksToDisplay || tasks;
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
        const todayDate = new Date().toLocaleDateString("en-CA");

        // فیلتر کردن تسک‌ها بر اساس بخش انتخابی
        const filteredTasks = tasksToRender.filter((task) => {
            switch (section) {
                case "myDay":
                    titleLink.textContent = "امروز";
                    return task.date === todayDate;
                case "thisWeek":
                    titleLink.textContent = "این هفته";
                    const getStartOfWeek = (date) => {
                        const day = date.getDay();
                        return new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate() - day
                        );
                    };

                    const getEndOfWeek = (date) => {
                        const day = date.getDay();
                        return new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate() + (6 - day)
                        );
                    };

                    const today = new Date();
                    const startOfWeek = getStartOfWeek(today);
                    const endOfWeek = getEndOfWeek(today);

                    const taskDate = new Date(task.date); // تبدیل task.date به یک شیء تاریخ برای مقایسه

                    return  taskDate >= startOfWeek && taskDate <= endOfWeek;
                case "thisMonth":
                    titleLink.textContent = "ماه فعلی";
                    const getStartOfMonth = (date) => {
                        return new Date(date.getFullYear(), date.getMonth(), 1);
                    };

                    // تابعی برای دریافت تاریخ پایان ماه جاری
                    const getEndOfMonth = (date) => {
                        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    };
                    const startOfMonth = getStartOfMonth(new Date());
                    const endOfMonth = getEndOfMonth(new Date());
                    return (
                        task.date >= startOfMonth.toISOString().slice(0, 10) &&
                        task.date <= endOfMonth.toISOString().slice(0, 10)
                    );
                case "other":
                    titleLink.textContent = "تمام تسک‌ها";
                    return true;// نمایش تمام تسک‌ها برای بخش "سایر"
                default:
                    return false; // پنهان کردن تسک‌ها برای بخش‌های ناشناخته
            }
        });

        taskContainer.innerHTML = filteredTasks
            .map(
                (task) => `
          <div class="card align" data-task-id="${task.id}">
            <input type="checkbox" name="task" id="${task.id}" ${task.completed ? "checked" : ""
                }>
            <div ${task.completed ? 'class="marker done"' : 'class="marker"'}>
              <span>${task.text}</span>
              <p id="taskDate" class="date ${isToday(task.date) ? "today" : ""}">${isToday(task.date)
                    ? "Today"
                    : "<i class='bx bx-calendar-alt'></i> " + task.date
                }</p>      
                <input type="date" id="hiddenDatePicker" style="display: none;" />        
            </div>
            <i class="bx bx-trash-alt"></i>
          </div>
        `
            )
            .join("");

        const searchInput = document.getElementById("search");

        // تابعی برای مدیریت ورودی جستجو و فیلتر کردن تسک‌ها
        const handleSearch = () => {
            toggleMenu();
            const searchText = searchInput.value.trim().toLowerCase();
            if (searchText !== "") {
                // // فیلتر کردن تسک‌ها بر اساس متن جستجو
                const filteredTasks = tasks.filter((task) =>
                    task.text.toLowerCase().includes(searchText)
                );
                displayTasks(currentSection, filteredTasks);
            } else {
                //// شنونده رویداد keydown را به فیلد جستجو اضافه کنید
                displayTasks(currentSection);
            }
        };


        // // شنونده رویداد keydown را به فیلد جستجو اضافه کنید
        const keydownHandler = (event) => {
            if (event.key === "Enter") {
                handleSearch();
                searchInput.removeEventListener("keydown", keydownHandler);
            }
        };

        // شنونده رویداد keydown را به فیلد جستجو اضافه کنید
        searchInput.addEventListener("keydown", keydownHandler);



        // شنونده رویداد را به کانتینر والد متصل کنید
        taskContainer.addEventListener("click", (event) => {
            // تغییرات چک باکس را مدیریت کنید
            if (event.target.type === "checkbox" && event.target.name === "task") {
                const taskId = event.target.id;
                const task = tasks.find((task) => task.id.toString() === taskId);
                if (task) {
                    task.completed = event.target.checked;
                    localStorage.setItem(task.id, JSON.stringify(task));
                    const marker = event.target.nextElementSibling;
                    if (marker.classList.contains("marker")) {
                        marker.classList.toggle("done", task.completed);
                    }
                }
            }

            // کلیک بر روی آیکون حذف را مدیریت کنید
            if (event.target.classList.contains("bx-trash-alt")) {
                const taskId = event.target.closest(".card").dataset.taskId;
                swal({
                    title: "تسک فعلی حذف شود؟",
                    text: "پس از حذف، شما نمی توانید این تسک را بازیابی کنید!",
                    icon: "warning",
                    buttons: ["نوچ", "آره"],
                }).then((willDelete) => {
                    if (willDelete) {
                        localStorage.removeItem(taskId);
                        event.target.closest(".card").remove();
                        swal("ای بابا! تسک شما حذف شد!", {
                            icon: "success",
                        });
                    }
                });
            }

            if (event.target.classList.contains("date")) {
                const taskId = event.target.closest(".card").dataset.taskId;
                const task = tasks.find((task) => task.id.toString() === taskId);

                if (task) {
                    // انتخابگر تاریخ را فعال کنید
                    document.getElementById('hiddenDatePicker').showPicker();

                    // برای تغییرات در انتخابگر تاریخ گوش دهید
                    document.getElementById('hiddenDatePicker').addEventListener('change', function () {
                        const selectedDate = this.value;

                        // Ask for confirmation before updating the date
                        swal({
                            title: "مطمعنی؟",
                            text:  `به روز رسانی تاریخ سررسید از ${task.date} to ${selectedDate}.`,
                            icon: "info",
                            buttons: ["نوچ", "آره"],
                        }).then((willChangeDate) => {
                            if (willChangeDate) {
                                // Update the date in local storage
                                task.date = selectedDate;
                                localStorage.setItem(taskId, JSON.stringify(task));

                                // صفحه نمایش را بازنشانی کنید
                                displayTasks(currentSection);
                            } else {
                                // تاریخ‌نگار را ریست کنید اگر کاربر لغو کرد

                                document.getElementById('hiddenDatePicker').value = '';
                            }
                        });
                    });
                }
            }
        });
        showDivisionsWithDelay();
    };

    const buttonsDiv = document.querySelector(".buttons");
    buttonsDiv.addEventListener("click", () => {
        swal({
            title: "همه داده ها حذف شود؟",
            text: "پس از حذف، نمی توانید این اطلاعات را بازیابی کنید!",
            icon: "warning",
            buttons: ["نوچ", "آره"],
        }).then((willDelete) => {
            if (willDelete) {
                // همه کلیدها را از localStorage بگیر

                const keys = Object.keys(localStorage);

                // کلید userPreferences را فیلتر کن
                const keysToKeep = keys.filter(key => key !== "userPreferences");

                // تمام localStorage را پاک کن به جز userPreferences
                keysToKeep.forEach(key => localStorage.removeItem(key));

                // محتوای taskContainer را پاک کن
                taskContainer.innerHTML = "";

                swal("تمام داده ها حذف شده است!", {
                    icon: "success",
                    buttons: {
                        confirm: "حله"
                    }
                });
            }
        });
    });



    const logoutLink = document.getElementById("logoutLink");

    logoutLink.addEventListener("click", () => {
        swal({
            title: "مطمعنی؟",
            text: "خروج نام و ایمیل پروفایل شما را حذف می کند.",
            icon: "warning",
            buttons: ["نوچ", "آره"],
        }).then((willLogout) => {
            if (willLogout) {
                // کاربر روی "خروج" کلیک کرد
                // تنظیمات کاربر را از حافظه محلی حذف کن
                localStorage.removeItem("userPreferences");

                // صفحه فعلی را تازه‌سازی کن
                window.location.reload();
            } else {
                // کاربر روی "لغو" کلیک کرد
              // هیچ کاری انجام ندهید یا مطابق با آن رسیدگی کنید

            }
        });
    });

    function getUserPreferences() {
        const storedPreferences = localStorage.getItem("userPreferences");
        const defaultPreferences = {
            name: "helenlria",
            email: "helenlria@gmail.com",
        };

        return storedPreferences
            ? JSON.parse(storedPreferences)
            : defaultPreferences;
    }
    // تابعی برای تنظیم ترجیحات کاربر در localStorage
    function setUserPreferences(name, email) {
        const preferences = { name, email };
        localStorage.setItem("userPreferences", JSON.stringify(preferences));
    }

// تابعی برای درخواست نام و ایمیل از کاربر با استفاده از SweetAlert
    function promptForNameAndEmail() {
        swal({
            title: "اطلاعات خود را وارد کنید",
            content: {
                element: "div",
                attributes: {
                    innerHTML: `
          <div class="form__group field">
            <input type="input" class="form__field" placeholder="Name" id="swal-input-name" required="">
            <label for="swal-input-name" class="form__label">اسم خوشگل شما</label>
          </div>
          <div class="form__group field">
            <input type="input" class="form__field" placeholder="Email" id="swal-input-email" required="">
            <label for="swal-input-email" class="form__label">ایمیل</label>
          </div>
        `,
                },
            },
            buttons: {
                cancel: "نه خیر☝🏻",
                confirm: "ذخیره",
            },
            closeOnClickOutside: false,
        }).then((result) => {
            if (result && result.dismiss !== "cancel") {
                const name = document.getElementById("swal-input-name").value;
                const email = document.getElementById("swal-input-email").value;

                // Set default values if the user didn't enter any details
                const finalName = name || "helenlria ";
                const finalEmail = email || "helenlria@gmail.com";

                setUserPreferences(finalName, finalEmail);
                displayProfileData();
            }
        });
    }

    // تابعی برای نمایش داده‌های پروفایل کاربر
    function displayProfileData() {
        const preferences = getUserPreferences();

        const nameElement = document.getElementById("name");
        const emailElement = document.getElementById("email");

        nameElement.textContent = preferences.name;
        emailElement.textContent = preferences.email;
    }
// بررسی کنید که آیا تنظیمات کاربر قبلاً تنظیم شده‌اند

    const preferences = getUserPreferences();

    if (
        preferences.name === "helenlria" &&
        preferences.email === "helenlria@gmail.com"
    ) {

// اگر تنظیمات پیش‌فرض باشد، از کاربر بخواهید که نام و ایمیل خود را وارد کند
        promptForNameAndEmail();
        promptForNameAndEmail();
    }

    // call the function to display profile data
    displayProfileData();


// گوش‌دهنده‌های رویداد برای لینک‌های بخش‌ها
    const handleSectionLinkClick = (section, linkElement) => {
        displayTasks(section);
        toggleMenu();

        // Remove the event listener for the clicked section link
        linkElement.removeEventListener("click", () => handleSectionLinkClick(section, linkElement));
    };

// گوش‌دهنده‌های رویداد برای لینک‌های بخش‌ها
    myDayLink.addEventListener("click", function () { handleSectionLinkClick("myDay", myDayLink); });
    thisWeekLink.addEventListener("click", function () { handleSectionLinkClick("thisWeek", thisWeekLink); });
    thisMonthLink.addEventListener("click", function () { handleSectionLinkClick("thisMonth", thisMonthLink); });
    otherLink.addEventListener("click", function () { handleSectionLinkClick("other", otherLink); });

    let currentSection = "myDay";
    displayTasks(currentSection);


    const burgerIcon = document.getElementById('burgerIcon');
    const containerLeft = document.getElementById('containerLeft');

    var toggleMenu = () => {
        containerLeft.classList.toggle('v-class');
        burgerIcon.classList.toggle('cross');
    };

    burgerIcon.addEventListener('click', toggleMenu);

    document.body.addEventListener('click', (event) => {
        const target = event.target;

        // ببین اگه عنصری که روش کلیک شده داخل containerLeft نیست
        if (!containerLeft.contains(target) && !burgerIcon.contains(target)) {
            containerLeft.classList.remove('v-class');
            burgerIcon.classList.remove('cross');
        }
    });
});
