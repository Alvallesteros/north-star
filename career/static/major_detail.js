const currentUrl = window.location.href;
const urlParts = currentUrl.split('/');
const lastSection = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
console.log(lastSection);

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/majors/' + lastSection)
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

            const subtitles_careers = document.createElement('h4');
            subtitles_careers.textContent = 'Related Careers';

            const careerList = document.createElement('ul');
            data.related_careers.forEach(career => {
                const careerItem = document.createElement('li');
                const careerLink = document.createElement('a');
                careerLink.href = `/careers/${career.career_id}`;
                careerLink.textContent = career.career;
                careerItem.appendChild(careerLink);
                careerList.appendChild(careerItem);
            });
            careerList.className = 'career-list';

            detail.appendChild(title);
            detail.appendChild(description);
            detail.appendChild(subtitles_careers);
            detail.appendChild(careerList);

            const editButton = document.getElementById('edit-button');
            if (editButton) {
                editButton.addEventListener('click', function() {
                    const title = prompt('Enter new title:', data.title);
                    const description = prompt('Enter new description:', data.description);
                    const relatedCareers = prompt('Enter new related career IDs (separated by commas):', data.related_careers.map(career => career.career_id).join(',')).split(',').map(career_id => career_id.trim());

                    if (title && description && relatedCareers) {
                        fetch('/api/majors/' + lastSection + '/', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                _id: data._id,
                                title: title,
                                description: description,
                                related_careers: relatedCareers
                            })
                        })
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw new Error('Failed to update the major');
                            }
                        })
                        .then(updatedData => {
                            console.log('Major updated successfully:', updatedData);
                        })
                        .catch(error => {
                            console.error('Error updating the major:', error);
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
                fetch('/api/majors/' + lastSection, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (response.ok) {
                        window.location.href = '/majors/';
                    } else {
                        console.error('Failed to delete the course');
                    }
                })
                .catch(error => {
                    console.error('Error deleting the course:', error);
                });
            });
        }

        const showTopButton = document.getElementById('show-top');
        if (showTopButton) {
            showTopButton.addEventListener('click', function() {
                fetch(`/api/majors/${lastSection}/top5`)
                    .then(response => response.json())
                    .then(topCareers => {
                        const detail = document.getElementById('course-detail');
                        
                        const topCareersTitle = document.createElement('h4');
                        topCareersTitle.textContent = 'Top 5 Careers';
                        
                        const topCareersList = document.createElement('ul');
                        topCareers.forEach(career => {
                            const careerItem = document.createElement('li');
                            
                            const careerLink = document.createElement('a');
                            careerLink.href = `/careers/${career._id}`;
                            careerLink.textContent = career.title;
                            
                            const careerSalary = document.createElement('span');
                            careerSalary.textContent = ` - $${career.salary.toLocaleString()}`;
                            
                            careerItem.appendChild(careerLink);
                            careerItem.appendChild(careerSalary);
                            topCareersList.appendChild(careerItem);
                        });
                        topCareersList.className = 'top-careers-list';
                        
                        detail.appendChild(topCareersTitle);
                        detail.appendChild(topCareersList);
                    })
                    .catch(error => {
                        console.error('Error fetching top careers:', error);
                    });
            });
        }
});