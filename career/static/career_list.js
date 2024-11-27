document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/careers/')
        .then(response => response.json())
        .then(data => {
            console.log(data);
        const courseList = document.getElementById('course-list');

        data.forEach(course => {
            const card = document.createElement('div');
            card.className = 'card';

            const courseItem = document.createElement('div');
            courseItem.className = 'course-item';

            const provider = document.createElement('h5');
            provider.textContent = course.field;
            courseItem.appendChild(provider);

            const title = document.createElement('h3');
            title.textContent = course.title;
            courseItem.appendChild(title);
            
            const description = document.createElement('p');
            description.textContent = course.description;
            courseItem.appendChild(description);

            const salary = document.createElement('p');
            salary.textContent = `Average Annual Salary: $${course.salary.toLocaleString()}`;
            courseItem.appendChild(salary);

            card.addEventListener('click', function() {
                window.location.href = `/careers/${course._id}`;
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
        const description = prompt('Enter Description:');
        const skill_id = prompt('Enter Skill IDs (comma separated):');
        const qualifications = prompt('Enter Qualifications (comma separated):');
        const field = prompt('Enter Field:');
        const salary = prompt('Enter Average Annual Salary:');
        const course_id = prompt('Enter Course IDs (comma separated):');

        const courseData = {
            title: title,
            description: description,
            skill_id: skill_id.split(',').map(id => id.trim()),
            qualifications: qualifications.split(',').map(qualification => qualification.trim()),
            field: field,
            salary: parseFloat(salary),
            course_id: course_id.split(',').map(id => id.trim())
        };

        fetch('/api/careers/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courseData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Career added:', data);
            // Optionally, you can refresh the career list or clear the form here
        })
        .catch(error => {
            console.error('Error adding career:', error);
        });
    });
});
