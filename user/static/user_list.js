document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/users/')
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
            title.textContent = course.username;
            courseItem.appendChild(title);
            
            const description = document.createElement('p');
            description.textContent = course.email;
            courseItem.appendChild(description);


            card.addEventListener('click', function() {
                window.location.href = `/users/${course._id}`;
            });

            card.appendChild(courseItem);
            courseList.appendChild(card);
        });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    const addUserButton = document.getElementById('add-form');
    addUserButton.addEventListener('click', function() {
    const username = prompt('Enter Username:');
    const email = prompt('Enter Email:');
    const name = prompt('Enter Name:');
    const age = prompt('Enter Age:');
    const major = prompt('Enter Major IDs (comma separated):');
    const skill_id = prompt('Enter Skill IDs (comma separated):');
    const fields = prompt('Enter Fields (comma separated):');
    const courses_taken = prompt('Enter Course IDs (comma separated):');
    const aspirations = prompt('Enter Aspirations:');

    const userData = {
        username: username,
        email: email,
        profile: {
            name: name,
            age: parseInt(age),
            major: major.split(',').map(id => id.trim()),
            skill_id: skill_id.split(',').map(id => id.trim()),
            fields: fields.split(',').map(field => field.trim()),
            courses_taken: courses_taken.split(',').map(id => id.trim()),
            aspirations: aspirations
        },
        recommendations: []
    };

    fetch('/api/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('User added:', data);
        // Optionally, you can refresh the user list or clear the form here
    })
    .catch(error => {
        console.error('Error adding user:', error);
    });
});

});
