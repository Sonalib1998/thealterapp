import React, { useState } from 'react';
import CommentSection from './CommentSection';
import TextEditor from './TextEditor';
import { ToastContainer } from 'react-toastify';

const MainComponent = () => {
    const [comments, setComments] = useState([
        {
            id: 1,
            user: { 
                name: 'Alice', 
                profilePicture: 'https://w0.peakpx.com/wallpaper/607/199/HD-wallpaper-evening-pic-natura-thumbnail.jpg' 
            },
            text: 'This is a comment.',
            createdAt: new Date(),
            reactions: { likes: 5, dislikes: 2 },
            replies: [],
            files: []
        },
        {
            id: 2,
            user: { 
                name: 'Bob', 
                profilePicture: 'https://cdn.pixabay.com/photo/2023/03/12/18/26/girl-7847557_640.jpg' 
            },
            text: 'This is another comment with a longer text that will be truncated if it exceeds the max length.',
            createdAt: new Date(),
            reactions: { likes: 3, dislikes: 1 },
            replies: [],
            files: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMrpvs8dNZP3ZJeYrwx7IHl6AvZ12r7N7ehw&s']
        }
    ]);

    const [sortOption, setSortOption] = useState('latest');

    const updateComments = (updatedComments) => {
        setComments(updatedComments);
    };

    const handleNewComment = (content) => {
        const newComment = {
            id: comments.length + 1,
            user: { 
                name: 'New User', 
                profilePicture: 'https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg' 
            },
            text: content,
            createdAt: new Date(),
            reactions: { likes: 0, dislikes: 0 },
            files: [],
            replies: []
        };
        setComments([newComment, ...comments]);
    };

    return (
        <div className="app-container">
            <TextEditor 
                onSubmitComment={handleNewComment} 
                comments={comments}
                sortOption={sortOption}
                setSortOption={setSortOption}
            />
            <CommentSection 
                comments={comments} 
                updateComments={updateComments} 
                sortOption={sortOption}
                setSortOption={setSortOption}
            />
            <ToastContainer />
        </div>
    );
};

export default MainComponent;
