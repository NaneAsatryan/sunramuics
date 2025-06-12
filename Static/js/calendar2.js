window.onload = function () {
    const calendars = document.querySelectorAll(".calendar");

    calendars.forEach((calendar) => {
        const daysContainer = calendar.querySelector(".days");
        const monthYearText = calendar.querySelector(".month-year");
        const prevBtn = calendar.querySelector(".prev");
        const nextBtn = calendar.querySelector(".next");
        let currentDate = new Date();

        function renderCalendar(date) {
            const year = date.getFullYear();
            const month = date.getMonth();
            const firstDay = new Date(year, month, 1).getDay();
            const lastDate = new Date(year, month + 1, 0).getDate();

            const monthName = date.toLocaleString("default", { month: "long" });
            monthYearText.textContent = `${monthName} ${year}`;
            daysContainer.innerHTML = "";

            for (let i = 0; i < firstDay; i++) {
                const emptyDiv = document.createElement("div");
                daysContainer.appendChild(emptyDiv);
            }

            const today = new Date();
            for (let i = 1; i <= lastDate; i++) {
                const dayDiv = document.createElement("div");
                dayDiv.textContent = i;

                const isToday =
                    i === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear();

                if (isToday) {
                    dayDiv.classList.add("today");
                }

                dayDiv.classList.add("day");
                dayDiv.addEventListener("click", () => {
                    daysContainer.querySelectorAll(".day").forEach(d => d.classList.remove("selected-day"));
                    dayDiv.classList.add("selected-day");
                });

                daysContainer.appendChild(dayDiv);
            }
        }

        prevBtn.addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });

        nextBtn.addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });

        renderCalendar(currentDate);
    });

    // Time slot selection logic (for all sections)
    const allSlots = document.querySelectorAll(".time-slots");
    allSlots.forEach(slotGroup => {
        const slots = slotGroup.querySelectorAll(".time-slot");
        slots.forEach(slot => {
            slot.addEventListener("click", () => {
                slots.forEach(s => s.classList.remove("selected"));
                slot.classList.add("selected");
            });
        });
    });

    // ✅ Scroll to service section on page load based on URL
    function scrollToService() {
        const params = new URLSearchParams(window.location.search);
        const scrollId = params.get("scroll");

        if (scrollId) {
            const number = scrollId.replace("service", "");
            const section = document.querySelector(`.box${number}`);
            if (section) {
                const yOffset = -113;
                const y = section.getBoundingClientRect().top + window.scrollY + yOffset;

                requestAnimationFrame(() => {
                    window.scrollTo(0, y);
                });
            }
        }
    }

    scrollToService(); // call it inside window.onload
};
