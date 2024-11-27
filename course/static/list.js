document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/courses/')
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
            title.textContent = course.title;
            courseItem.appendChild(title);
            
            const provider = document.createElement('p');
            provider.textContent = `Provider: ${course.provider}`;
            courseItem.appendChild(provider);

            const description = document.createElement('p');
            description.textContent = course.description;
            courseItem.appendChild(description);

            const link = document.createElement('a');
            link.href = course.link;
            link.textContent = 'Course Link';
            courseItem.appendChild(link);


            card.addEventListener('click', function() {
                window.location.href = `/courses/${course._id}`;
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
        const title = prompt('Enter Course Title:');
        const provider = prompt('Enter Provider:');
        const description = prompt('Enter Description:');
        const link = prompt('Enter Course Link:');
        const topics = prompt('Enter Topics (comma separated):');
        const difficulty = prompt('Enter Difficulty (Beginner, Intermediate, Advanced):');
        const skill_id = prompt('Enter Skill IDs (comma separated):');
        const career_id = prompt('Enter Career IDs (comma separated):');

        const courseData = {
            title: title,
            provider: provider,
            description: description,
            link: link,
            topics: topics.split(',').map(topic => topic.trim()),
            difficulty: difficulty,
            skill_id: skill_id.split(',').map(id => id.trim()),
            career_id: career_id.split(',').map(id => id.trim())
        };

        fetch('/api/courses/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courseData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Course added:', data);
            // Optionally, you can refresh the course list or clear the form here
        })
        .catch(error => {
            console.error('Error adding course:', error);
        });
    });
});
