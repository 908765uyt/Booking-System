document.addEventListener("DOMContentLoaded", function () {
    const rooms = [
        { id: 1, name: "Room A", available: true },
        { id: 2, name: "Room B", available: true },
        { id: 3, name: "Room C", available: true }
    ];

    const roomSelector = document.getElementById("room-selector");
    const timeSlotInput = document.getElementById("time-slot");
    const bookingList = document.getElementById("booking-list");

    // Display Available Rooms
    function displayAvailableRooms() {
        const roomListDiv = document.getElementById("room-list");
        roomListDiv.innerHTML = "<h2>Available Rooms</h2>";
        rooms.forEach((room) => {
            const roomDiv = document.createElement("div");
            roomDiv.textContent = `${room.name} - ${room.available ? "Available" : "Booked"}`;
            roomListDiv.appendChild(roomDiv);
        });
    }

    // Function to check if a room is available for the given time slot
    function isRoomAvailable(roomId, timeSlot) {
        const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        return !bookings.some((booking) => booking.roomId === roomId && booking.timeSlot === timeSlot);
    }

    // Booking a Room
    function bookRoom() {
        const roomId = parseInt(roomSelector.value);
        const timeSlot = timeSlotInput.value;

        if (!timeSlot || !/^(\d{1,2}:\d{2}-\d{1,2}:\d{2})$/.test(timeSlot)) {
            alert("Invalid time slot format. Please use HH:mm-HH:mm (e.g., 9:00-9:30).");
            return;
        }

        if (!isRoomAvailable(roomId, timeSlot)) {
            alert("This room is already booked for the selected time slot.");
            return;
        }

        const booking = { roomId, timeSlot };
        const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        bookings.push(booking);
        localStorage.setItem("bookings", JSON.stringify(bookings));

        // Update room availability
        const room = rooms.find((room) => room.id === roomId);
        if (room) {
            room.available = false;
        }

        // Refresh UI
        displayAvailableRooms();
        displayMyBookings();
    }

    // Viewing Bookings
    function displayMyBookings() {
        const myBookings = JSON.parse(localStorage.getItem("bookings")) || [];
        bookingList.innerHTML = "<h2>My Bookings</h2>";
        myBookings.forEach((booking) => {
            const room = rooms.find((r) => r.id === booking.roomId);
            if (room) {
                const listItem = document.createElement("div");
                listItem.textContent = `${room.name} - ${booking.timeSlot}`;
                bookingList.appendChild(listItem);
            }
        });
    }

    // Editing and Canceling Bookings
    function cancelBooking(roomId, timeSlot) {
        const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        const updatedBookings = bookings.filter((booking) => !(booking.roomId === roomId && booking.timeSlot === timeSlot));
        localStorage.setItem("bookings", JSON.stringify(updatedBookings));

        // Update room availability
        const room = rooms.find((room) => room.id === roomId);
        if (room) {
            room.available = true;
        }

        // Refresh UI
        displayAvailableRooms();
        displayMyBookings();
    }

    // Event listeners for booking, canceling, and editing bookings
    const bookButton = document.getElementById("book-button");
    bookButton.addEventListener("click", bookRoom);

    const cancelBookingButton = document.getElementById("cancel-booking-button");
    cancelBookingButton.addEventListener("click", function () {
        const roomId = parseInt(roomSelector.value);
        const timeSlot = timeSlotInput.value;
        cancelBooking(roomId, timeSlot);
    });

    // Initialize the UI
    displayAvailableRooms();
    displayMyBookings();
});
