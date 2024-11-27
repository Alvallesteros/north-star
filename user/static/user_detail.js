const currentUrl = window.location.href;
const urlParts = currentUrl.split('/');
const lastSection = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
console.log(lastSection);

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/users/' + lastSection)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const detail = document.getElementById('course-detail');

            const username = document.createElement('h2');
            username.textContent = `@${data.username}`;

            const title = document.createElement('h1');
            title.className = 'user-title';
            title.textContent = data.profile.name;

            const email = document.createElement('p');
            email.className = 'user-email';
            email.textContent = data.email;

            const age = document.createElement('p');
            age.className = 'user-age';
            age.textContent = `${data.profile.age} years old`;

            const majorList = document.createElement('ul');
            data.profile.major.forEach(major => {
                const majorItem = document.createElement('li');
                const majorLink = document.createElement('a');
                majorLink.href = `/majors/${major.major_id}`;
                majorLink.textContent = major.major;
                majorItem.appendChild(majorLink);
                majorList.appendChild(majorItem);
            });
            majorList.className = 'major-list';

            const skillList = document.createElement('ul');
            data.profile.skill_id.forEach(skill => {
                const skillItem = document.createElement('li');
                const skillLink = document.createElement('a');
                skillLink.href = `/skills/${skill.skill_id}`;
                skillLink.textContent = skill.skill;
                skillItem.appendChild(skillLink);
                skillList.appendChild(skillItem);
            });
            skillList.className = 'skill-list';

            const fields = document.createElement('p');
            fields.className = 'user-fields';
            fields.textContent = `Interested Fields: ${data.profile.fields.join(', ')}`;

            const aspirations = document.createElement('p');
            aspirations.className = 'user-aspirations';
            aspirations.textContent = `Aspirations: ${data.profile.aspirations}`;

            const recommendationsList = document.createElement('ul');
            data.recommendations.forEach(recommendation => {
                const recommendationItem = document.createElement('li');
                const recommendationLink = document.createElement('a');
                recommendationLink.href = `/careers/${recommendation.career_id}`;
                recommendationLink.textContent = recommendation.career;
                recommendationItem.appendChild(recommendationLink);
                recommendationsList.appendChild(recommendationItem);
            });
            recommendationsList.className = 'recommendations-list';

            const coursesList = document.createElement('ul');
            data.profile.courses_taken.forEach(recommendation => {
                const coursesItem = document.createElement('li');
                const coursesLink = document.createElement('a');
                coursesLink.href = `/courses/${recommendation.course_id}`;
                coursesLink.textContent = recommendation.course;
                coursesItem.appendChild(coursesLink);
                coursesList.appendChild(coursesItem);
            });
            recommendationsList.className = 'recommendations-list';

            const subMajor = document.createElement('h4');
            subMajor.textContent = 'Major';

            const subSkills = document.createElement('h4');
            subSkills.textContent = 'Skills';

            const subCareers = document.createElement('h4');
            subCareers.textContent = 'Recommended Careers';

            const subCourses = document.createElement('h4');
            subCourses.textContent = 'Courses Taken';

            detail.appendChild(title);
            detail.appendChild(username);
            detail.appendChild(email);
            detail.appendChild(age);
            detail.appendChild(fields);
            detail.appendChild(aspirations);
            detail.appendChild(subMajor);
            detail.appendChild(majorList);
            detail.appendChild(subSkills);
            detail.appendChild(skillList);
            detail.appendChild(subCareers);
            detail.appendChild(recommendationsList);
            detail.appendChild(subCourses);
            detail.appendChild(coursesList);

            const editButton = document.getElementById('edit-button');
            if (editButton) {
                editButton.addEventListener('click', function() {
                    const username = prompt('Enter new username:', data.username);
                    const email = prompt('Enter new email:', data.email);
                    const name = prompt('Enter new name:', data.profile.name);
                    const age = prompt('Enter new age:', data.profile.age);
                    const majorIds = prompt('Enter new major IDs (comma separated):', data.profile.major.map(major => major.major_id).join(', ')).split(',').map(id => id.trim());
                    const skillIds = prompt('Enter new skill IDs (comma separated):', data.profile.skill_id.map(skill => skill.skill_id).join(', ')).split(',').map(id => id.trim());
                    const fields = prompt('Enter new fields (comma separated):', data.profile.fields.join(', ')).split(',').map(field => field.trim());
                    const aspirations = prompt('Enter new aspirations:', data.profile.aspirations);
                    const coursesTaken = prompt('Enter new courses taken (comma separated):', data.profile.courses_taken.map(course => course.course_id).join(', ')).split(',').map(id => id.trim());

                    if (username && email && name && age && majorIds && skillIds && fields && aspirations && coursesTaken) {
                        fetch('/api/users/' + lastSection + '/', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                _id: data._id,
                                username: username,
                                email: email,
                                profile: {
                                    name: name,
                                    age: age,
                                    major: majorIds,
                                    skill_id: skillIds,
                                    fields: fields,
                                    aspirations: aspirations,
                                    courses_taken: coursesTaken
                                },
                                recommendations: []
                            })
                        })
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw new Error('Failed to update the user profile');
                            }
                        })
                        .then(updatedData => {
                            console.log('User profile updated successfully:', updatedData);
                        })
                        .catch(error => {
                            console.error('Error updating the user profile:', error);
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
    const showGapsButton = document.getElementById('show-gaps');
    const container = document.getElementById('course-detail');
    if (showGapsButton) {
        showGapsButton.addEventListener('click', function() {
            fetch(`/api/users/${lastSection}/skill_gaps/`)
                .then(response => response.json())
                .then(skillGaps => {
                    const gapsContainer = document.createElement('div');
                    gapsContainer.className = 'skill-gaps-container';

                    const titleGap = document.createElement('h4');
                    titleGap.textContent = 'Recommended Courses for Skill Gaps';

                    skillGaps.forEach(gap => {
                        const gapItem = document.createElement('div');
                        gapItem.className = 'skill-gap-item';

                        const gapName = document.createElement('h3');
                        gapName.textContent = gap.name;
                        gapItem.appendChild(gapName);

                        const coursesList = document.createElement('ul');
                        gap.courses.forEach(course => {
                            const courseItem = document.createElement('li');
                            const courseLink = document.createElement('a');
                            courseLink.href = `/courses/${course.course_id}`;
                            courseLink.textContent = course.course;
                            courseItem.appendChild(courseLink);
                            coursesList.appendChild(courseItem);
                        });
                        gapItem.appendChild(coursesList);

                        gapsContainer.appendChild(gapItem);
                    });
                    container.appendChild(titleGap);
                    container.appendChild(gapsContainer);
                })
                .catch(error => {
                    console.error('Error fetching skill gaps:', error);
                });
        });
    }
});