//DOM elements
const email = document.querySelector('#emailField');
const password = document.querySelector('#passwordField');
const registerSubmit = document.querySelector('#registerBtn');
const loginSubmit = document.querySelector('#loginBtn');
const createSubmit = document.querySelector('#createBtn');
const loginBtn = document.querySelector('#loginNavBtn');


const register = async (e) => {
    e.preventDefault();
    //function handles login
    console.log(email.value, password.value);
    let token;
    try {
        token = await fetch('/api/auth/register', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: email.value, password: password.value})
        })
        if(token.ok) {
            token = await token.json();
            localStorage.setItem('token', token.token);
            await populatePosts();
            window.location.replace('/');
        } else {
            throw new Error('Error, try again')
        }

    } catch (error) {
        const loginError = document.querySelector('.error');
        loginError.textContent = error.message;
    }

}

const login = async(e) => {
    e.preventDefault();
    //function handles login
    console.log(email.value, password.value);
    let token;
    try {
        token = await fetch('/api/auth/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: email.value, password: password.value})
        })
        if(token.ok) {
            token = await token.json();
            localStorage.setItem('token', token.token);
            window.location.replace('/');
        } else {
            throw new Error('Invalid credentials, try again');
        }

    } catch (error) {
        const loginError = document.querySelector('.error');
        loginError.textContent = error.message;
    }
}
if(registerSubmit) registerSubmit.addEventListener('click', register);
if(loginSubmit) loginSubmit.addEventListener('click', login);

//need function to get all the posts from the data base can then inject post elements into dom
const populatePosts = async () => {
    const section = document.querySelector('.post-section');
    const token = localStorage.getItem('token');
    const error = document.createElement('div');
    if(!token) {
        error.textContent = 'Please login first.';
        section.appendChild(error);
        return;
    }
    try {
        let posts = await fetch('/api/posts', {
            method: 'get',
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        if(posts.ok) {
            posts = await posts.json();
            posts = posts.posts;
            console.log(posts);
            if(posts.length === 0) {
                error.textContent = 'No posts to display.';
                section.appendChild(error);
            }
            posts.map((post) => {
                const container = document.createElement('div');
                const image = document.createElement('img');
                const description = document.createElement('div');
                const header = document.createElement('h2'); 
                const location = document.createElement('h3');

                container.appendChild(image);
                container.appendChild(description);
                description.appendChild(header)
                description.appendChild(location);

                header.textContent = post.name;
                location.textContent = post.location;
                container.classList.add('container');
                image.src = post.image;
                image.classList.add('post', 'cropped-ofp');
                description.classList.add('description');
                section.appendChild(container);
            })
        }
    } catch (err) {
        error.textContent = 'Error! Please try again.'
        section.appendChild(error);
    }
    
}

const createPost = async (e) => {
    e.preventDefault();
    const name = document.querySelector('#nameField').value;
    const location = document.querySelector('#locationField').value;
    const image = document.querySelector('#imgField').files[0];
    let formData = new FormData();
    formData.append('image', image);
    const token = localStorage.getItem('token');
    try {
        let imagePath = await fetch('/api/posts/uploadImage', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })
        if(imagePath.ok) {
            imagePath = await imagePath.json();
            imagePath = imagePath.image;

            const post = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({name, location, image: imagePath})
            });
            if(post.ok) {
                window.location.replace('/posts_page.html');
            } else {
                throw new Error('Error, try again');
            }

        } else {
            throw new Error('Error, try again');
        }
    } catch (error) {
        const loginError = document.querySelector('.error');
        loginError.textContent = error.message;
    }
    
}
const logout = () => {
    localStorage.removeItem('token');
}

if(document.URL === 'http://localhost:3000/posts_page.html') {
    populatePosts();
}

if(createSubmit) createSubmit.addEventListener('click', createPost );

if(loginBtn && localStorage.getItem('token')) {
    loginBtn.textContent = 'Logout';
    loginBtn.addEventListener('click', logout);
    loginBtn.setAttribute('href', '/');
}
