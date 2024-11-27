const currentUrl = window.location.href;
const urlParts = currentUrl.split('/');
const lastSection = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
console.log(lastSection);

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/careers/' + lastSection + '/')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const detail = document.getElementById('course-detail');
        
            const title = document.createElement('h1');
            title.className = 'course-title';
            title.textContent = data.title;
            
            const description = document.createElement('p');
            description.className = 'course-description';
            description.textContent = data.description;

            const link = document.createElement('h2');
            link.className = 'course-link';
            link.textContent = data.field;

            const skillList = document.createElement('ul');
            data.skill_id.forEach(skill => {
                const skillItem = document.createElement('li');
                const skillLink = document.createElement('a');
                skillLink.href = `/skills/${skill.skill_id}`;
                skillLink.textContent = skill.skill;
                skillItem.appendChild(skillLink);
                skillList.appendChild(skillItem);
            });
            skillList.className = 'skill-list';

            const topicList = document.createElement('ul');
            data.qualifications.forEach(topic => {
                const topicItem = document.createElement('li');
                topicItem.textContent = topic;
                topicList.appendChild(topicItem);
            });
            topicList.className = 'topic-list';

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
            subtitles_skills.textContent = 'Related Skills';

            const subtitles_topics = document.createElement('h4');
            subtitles_topics.textContent = 'Qualifications';

            const subtitles_careers = document.createElement('h4');
            subtitles_careers.textContent = 'Related Courses';

            const difficulty = document.createElement('h3');
            difficulty.textContent = `Average Annual Salary: $${data.salary.toLocaleString()}`;

            detail.appendChild(link);
            detail.appendChild(title);
            detail.appendChild(description);
            detail.appendChild(difficulty);
            detail.appendChild(subtitles_topics);
            detail.appendChild(topicList);
            detail.appendChild(subtitles_skills);   
            detail.appendChild(skillList);
            detail.appendChild(subtitles_careers);
            detail.appendChild(careerList);

            const editButton = document.getElementById('edit-button');
            if (editButton) {
                editButton.addEventListener('click', function() {
                    const title = prompt('Enter new title:', data.title);
                    const description = prompt('Enter new description:', data.description);
                    const field = prompt('Enter new field:', data.field);
                    const salary = prompt('Enter new salary:', data.salary);
                    const qualifications = prompt('Enter new qualifications (comma separated):', data.qualifications.join(', ')).split(',').map(qualification => qualification.trim());
                    const skillIds = prompt('Enter new skill IDs (comma separated):', data.skill_id.map(skill => skill.skill_id).join(', ')).split(',').map(id => id.trim());
                    const careerIds = prompt('Enter new course IDs (comma separated):', data.course_id.map(career => career.course_id).join(', ')).split(',').map(id => id.trim());

                    if (title && description && field && salary && qualifications && skillIds && careerIds) {
                        fetch('/api/careers/' + lastSection + '/', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                _id: data._id,
                                title: title,
                                description: description,
                                field: field,
                                salary: parseInt(salary),
                                qualifications: qualifications,
                                skill_id: skillIds,
                                course_id: careerIds
                            })
                        })
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw new Error('Failed to update the career');
                            }
                        })
                        .then(updatedData => {
                            console.log('Career updated successfully:', updatedData);
                        })
                        .catch(error => {
                            console.error('Error updating the career:', error);
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
                fetch('/api/careers/' + lastSection, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (response.ok) {
                        window.location.href = '/careers/';
                    } else {
                        console.error('Failed to delete the course');
                    }
                })
                .catch(error => {
                    console.error('Error deleting the course:', error);
                });
            });
        }
});