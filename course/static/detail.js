const currentUrl = window.location.href;
const urlParts = currentUrl.split('/');
const lastSection = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
console.log(lastSection);

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/courses/' + lastSection)
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

            const link = document.createElement('a');
            link.className = 'course-link';
            link.href = data.link;
            link.textContent = data.provider;

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
            data.topics.forEach(topic => {
                const topicItem = document.createElement('li');
                topicItem.textContent = topic;
                topicList.appendChild(topicItem);
            });
            topicList.className = 'topic-list';

            const careerList = document.createElement('ul');
            data.career_id.forEach(career => {
                const careerItem = document.createElement('li');
                const careerLink = document.createElement('a');
                careerLink.href = `/careers/${career.career_id}`;
                careerLink.textContent = career.career;
                careerItem.appendChild(careerLink);
                careerList.appendChild(careerItem);
            });
            careerList.className = 'career-list';

            const subtitles_skills = document.createElement('h4');
            subtitles_skills.textContent = 'Related Skills';

            const subtitles_topics = document.createElement('h4');
            subtitles_topics.textContent = 'Topics';

            const subtitles_careers = document.createElement('h4');
            subtitles_careers.textContent = 'Related Careers';

            const difficulty = document.createElement('h3');
            difficulty.textContent = `${data.difficulty}`;

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
                    const link = prompt('Enter new link:', data.link);
                    const difficulty = prompt('Enter new difficulty:', data.difficulty);
                    const provider = prompt('Enter new provider:', data.provider);
                    const topics = prompt('Enter new topics (comma separated):', data.topics.join(', ')).split(',').map(topic => topic.trim());
                    const skillIds = prompt('Enter new skill IDs (comma separated):', data.skill_id.map(skill => skill.skill_id).join(', ')).split(',').map(id => id.trim());
                    const careerIds = prompt('Enter new career IDs (comma separated):', data.career_id.map(career => career.career_id).join(', ')).split(',').map(id => id.trim());

                    if (title && description && link && difficulty && provider && topics && skillIds && careerIds) {
                        fetch('/api/courses/' + lastSection + '/', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                _id: data._id,
                                title: title,
                                provider: provider,
                                description: description,
                                link: link,
                                topics: topics,
                                difficulty: difficulty,
                                skill_id: skillIds,
                                career_id: careerIds
                            })
                        })
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw new Error('Failed to update the course');
                            }
                        })
                        .then(updatedData => {
                            console.log('Course updated successfully:', updatedData);
                        })
                        .catch(error => {
                            console.error('Error updating the course:', error);
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
                fetch('/api/courses/' + lastSection, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (response.ok) {
                        window.location.href = '/courses';
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