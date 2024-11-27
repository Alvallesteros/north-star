document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/majors/')
        .then(response => response.json())
        .then(data => {
            console.log(data);
        const courseList = document.getElementById('course-list');

        data.forEach(course => {
            const card = document.createElement('div');
            card.className = 'card';

            const courseItem = document.createElement('div');
            courseItem.className = 'course-item';

            const title = document.createElement('h3');
            title.textContent = course.title;
            courseItem.appendChild(title);

            const description = document.createElement('p');
            description.textContent = course.description;
            courseItem.appendChild(description);

            card.addEventListener('click', function() {
                window.location.href = `/majors/${course._id}`;
            });

            card.appendChild(courseItem);
            courseList.appendChild(card);
        });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    const addCourseButton = document.getElementById('add-form');
    addCourseButton.addEventListener('click', function() {
        const title = prompt('Enter Major Title:');
        const description = prompt('Enter Description:');
        const relatedCareers = prompt('Enter Related Career IDs (comma separated):');

        const courseData = {
            title: title,
            description: description,
            related_careers: relatedCareers.split(',').map(id => id.trim())
        };

        fetch('/api/majors/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courseData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Major added:', data);
            // Optionally, you can refresh the career list or clear the form here
        })
        .catch(error => {
            console.error('Error adding major:', error);
        });
    });
});