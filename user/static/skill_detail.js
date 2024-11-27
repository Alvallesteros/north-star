const currentUrl = window.location.href;
const urlParts = currentUrl.split('/');
const lastSection = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
console.log(lastSection);

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/skills/' + lastSection)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const detail = document.getElementById('course-detail');
        
            const title = document.createElement('h1');
            title.className = 'course-title';
            title.textContent = data.name;
            
            const description = document.createElement('p');
            description.className = 'course-description';
            description.textContent = data.description;

            const link = document.createElement('a');
            link.className = 'course-link';
            link.href = data.link;
            link.textContent = data.provider;

            const skillList = document.createElement('ul');
            data.career_id.forEach(skill => {
                const skillItem = document.createElement('li');
                const skillLink = document.createElement('a');
                skillLink.href = `/careers/${skill.career_id}`;
                skillLink.textContent = skill.career;
                skillItem.appendChild(skillLink);
                skillList.appendChild(skillItem);
            });
            skillList.className = 'skill-list';

            const careerList = document.createElement('ul');
            data.course_id.forEach(career => {
                const careerItem = document.createElement('li');
                const careerLink = document.createElement('a');
                careerLink.href = `/courses/${career.course_id}`;
                careerLink.textContent = career.course;
                careerItem.appendChild(careerLink);
                careerList.appendChild(careerItem);
            });
            careerList.className = 'career-list';

            const subtitles_skills = document.createElement('h4');
            subtitles_skills.textContent = 'Related Careers';

            const subtitles_topics = document.createElement('h4');
            subtitles_topics.textContent = 'Topics';

            const subtitles_careers = document.createElement('h4');
            subtitles_careers.textContent = 'Related Courses';

            const difficulty = document.createElement('h3');
            difficulty.textContent = `${data.difficulty}`;

            detail.appendChild(link);
            detail.appendChild(title);
            detail.appendChild(description);
            detail.appendChild(difficulty);
            detail.appendChild(subtitles_skills);   
            detail.appendChild(skillList);
            detail.appendChild(subtitles_careers);
            detail.appendChild(careerList);

            const editButton = document.getElementById('edit-button');
            if (editButton) {
                editButton.addEventListener('click', function() {
                    const name = prompt('Enter new name:', data.name);
                    const description = prompt('Enter new description:', data.description);
                    const difficulty = prompt('Enter new difficulty:', data.difficulty);
                    const careerIds = prompt('Enter new career IDs (comma separated):', data.career_id.map(career => career.career_id).join(', ')).split(',').map(id => id.trim());
                    const courseIds = prompt('Enter new course IDs (comma separated):', data.course_id.map(course => course.course_id).join(', ')).split(',').map(id => id.trim());

                    if (name && description && difficulty && careerIds && courseIds) {
                        fetch('/api/skills/' + lastSection + '/', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                _id: data._id,
                                name: name,
                                description: description,
                                difficulty: difficulty,
                                career_id: careerIds,
                                course_id: courseIds
                            })
                        })
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw new Error('Failed to update the skill');
                            }
                        })
                        .then(updatedData => {
                            console.log('Skill updated successfully:', updatedData);
                        })
                        .catch(error => {
                            console.error('Error updating the skill:', error);
                        });
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
        const deleteButton = document.getElementById('delete-button');
        if (deleteButton) {
            deleteButton.addEventListener('click', function() {
                fetch('/api/skills/' + lastSection, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (response.ok) {
                        window.location.href = '/skills';
                    } else {
                        console.error('Failed to delete the skill');
                    }
                })
                .catch(error => {
                    console.error('Error deleting the skill:', error);
                });
            });
        }
});