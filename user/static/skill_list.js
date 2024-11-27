document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/skills/')
        .then(response => response.json())
        .then(data => {
            console.log(data);
        const courseList = document.getElementById('course-list');

        data.forEach(course => {
            const card = document.createElement('div');
            card.className = 'card';

            const courseItem = document.createElement('div');
            courseItem.className = 'course-item';

            const difficulty = document.createElement('p');
            difficulty.textContent =  course.difficulty;
            courseItem.appendChild(difficulty);

            const title = document.createElement('h3');
            title.textContent = course.name;
            courseItem.appendChild(title);
            
            const description = document.createElement('p');
            description.textContent = course.description;
            courseItem.appendChild(description);


            card.addEventListener('click', function() {
                window.location.href = `/skills/${course._id}`;
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
        const name = prompt('Enter Skill Name:');
        const description = prompt('Enter Description:');
        const difficulty = prompt('Enter Difficulty (Beginner, Intermediate, Advanced):');
        const career_id = prompt('Enter Career IDs (comma separated):');
        const course_id = prompt('Enter Course IDs (comma separated):');

        const courseData = {
            name: name,
            description: description,
            difficulty: difficulty,
            career_id: career_id.split(',').map(id => id.trim()),
            course_id: course_id.split(',').map(id => id.trim())
        };

        fetch('/api/skills/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courseData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Skill added:', data);
            // Optionally, you can refresh the course list or clear the form here
        })
        .catch(error => {
            console.error('Error adding skill:', error);
        });
    });
});
