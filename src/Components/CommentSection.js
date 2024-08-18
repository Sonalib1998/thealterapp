import React, { useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import '../App.css'; // Import the CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faUnderline, faLink, faImage } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const COMMENTS_PER_PAGE = 8;
const MAX_CHAR_LIMIT = 250;

const CommentSection = ({ comments, updateComments, sortOption, setSortOption }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [reply, setReply] = useState({});
    const [replyText, setReplyText] = useState({});
    const [expandedComments, setExpandedComments] = useState({});
    const editorRefs = useRef({});

    const handleReplySubmit = (commentId) => {
        if (!replyText[commentId] || replyText[commentId].trim() === '') {
            return;
        }

        const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: [
                        ...comment.replies,
                        {
                            user: { name: 'New User' },
                            text: replyText[commentId]
                        }
                    ]
                };
            }
            return comment;
        });

        updateComments(updatedComments);
        setReplyText({ ...replyText, [commentId]: '' });
        setReply({ ...reply, [commentId]: false });
    };

    const handleReplyChange = (id, event) => {
        setReplyText({ ...replyText, [id]: event.target.innerText });
    };

    const handleReplyImageUpload = (id, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const imageUrl = reader.result;
                // Use image URL in editor here
                const updatedText = (replyText[id] || '') + `<img src="${imageUrl}" alt="Image" />`;
                setReplyText({ ...replyText, [id]: updatedText });
                editorRefs.current[id].focus();
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormatting = (id, command) => {
        // Implement text formatting here
        // For example, use a rich text editor library
    };

    const handleLinkInsert = (id) => {
        const url = prompt('Enter the URL:');
        if (url) {
            const updatedText = (replyText[id] || '') + `<a href="${url}">${url}</a>`;
            setReplyText({ ...replyText, [id]: updatedText });
            editorRefs.current[id].focus();
        }
    };

    const handleReplyCancel = (commentId) => {
        setReplyText({ ...replyText, [commentId]: '' });
        setReply({ ...reply, [commentId]: false });
    };

    const handleReaction = (id, type) => {
        const updatedComments = comments.map(comment => {
            if (comment.id === id) {
                return {
                    ...comment,
                    reactions: {
                        ...comment.reactions,
                        [type]: comment.reactions[type] + 1
                    }
                };
            }
            return comment;
        });

        updateComments(updatedComments);
        toast.success(`Comment ${type}d!`);
    };

    const handleReplyClick = (id) => {
        setReply({ ...reply, [id]: !reply[id] });
    };

    const sortComments = (comments) => {
        if (sortOption === 'latest') {
            return [...comments].sort((a, b) => b.createdAt - a.createdAt);
        } else if (sortOption === 'popularity') {
            return [...comments].sort((a, b) => b.reactions.likes - a.reactions.likes);
        }
        return comments;
    };

    const currentComments = sortComments(comments).slice((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE);

    const handlePagination = (page) => {
        setCurrentPage(page);
    };

    const toggleExpand = (id) => {
        setExpandedComments({
            ...expandedComments,
            [id]: !expandedComments[id]
        });
    };

    return (
        <div>
            <div>
                {currentComments.length === 0 ? (
                    <p>No comments available.</p>
                ) : (
                    currentComments.map(comment => {
                        const isExpanded = expandedComments[comment.id] || false;
                        const isLong = comment.text.split('\n').length > 5;
                        const displayText = isExpanded || !isLong ? comment.text : comment.text.split('\n').slice(0, 5).join('\n') + '...';

                        return (
                            <div key={comment.id} className="comment-container">
                                <div className="comment-header">
                                    <img 
                                        src={comment.user.profilePicture} 
                                        alt={comment.user.name} 
                                        className="profile-picture" 
                                    />
                                    <strong>{comment.user.name}</strong>
                                </div>
                                <p>{displayText}</p>
                                {isLong && (
                                    <button onClick={() => toggleExpand(comment.id)}>
                                        {isExpanded ? 'Show Less' : 'Show More'}
                                    </button>
                                )}
                                {comment.files && comment.files.length > 0 && (
                                    <div className="file-thumbnails">
                                        {comment.files.map((file, index) => (
                                            <img key={index} src={file} alt={`Attachment ${index + 1}`} className="thumbnail" />
                                        ))}
                                    </div>
                                )}
                                <small>Posted {formatDistanceToNow(comment.createdAt, { addSuffix: true })}</small>
                                <div className="reactions">
                                    <button onClick={() => handleReaction(comment.id, 'likes')}>
                                        👍 {comment.reactions.likes}
                                    </button>
                                    <button onClick={() => handleReaction(comment.id, 'dislikes')}>
                                        👎 {comment.reactions.dislikes}
                                    </button>
                                    <button onClick={() => handleReplyClick(comment.id)}>
                                        Reply
                                    </button>
                                </div>
                                {reply[comment.id] && (
                                    <div className="reply-section">
                                        <div 
                                            ref={el => editorRefs.current[comment.id] = el}
                                            contentEditable
                                            className="editor"
                                            onInput={(e) => handleReplyChange(comment.id, e)}
                                            suppressContentEditableWarning={true}
                                            placeholder="Write a reply..."
                                            dir="ltr" // Ensures text is input in left-to-right direction
                                        >
                                            {replyText[comment.id]}
                                        </div>
                                        <div className="editor-controls">
                                            <div className="char-count">{(replyText[comment.id] || '').length}/{MAX_CHAR_LIMIT}</div>
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={(e) => handleReplyImageUpload(comment.id, e)}
                                                className="image-upload"
                                                id={`image-upload-${comment.id}`}
                                            />
                                            <label htmlFor={`image-upload-${comment.id}`}>
                                                <button className="icon-button">
                                                    <FontAwesomeIcon icon={faImage} />
                                                </button>
                                            </label>
                                            <button className="icon-button" onClick={() => handleFormatting(comment.id, 'bold')}>
                                                <FontAwesomeIcon icon={faBold} />
                                            </button>
                                            <button className="icon-button" onClick={() => handleFormatting(comment.id, 'italic')}>
                                                <FontAwesomeIcon icon={faItalic} />
                                            </button>
                                            <button className="icon-button" onClick={() => handleFormatting(comment.id, 'underline')}>
                                                <FontAwesomeIcon icon={faUnderline} />
                                            </button>
                                            <button className="icon-button" onClick={() => handleLinkInsert(comment.id)}>
                                                <FontAwesomeIcon icon={faLink} />
                                            </button>
                                            <div className="submit-container">
                                                <button className="submit-button" onClick={() => handleReplySubmit(comment.id)}>Send</button>
                                                <button className="cancel-button" onClick={() => handleReplyCancel(comment.id)}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {comment.replies.length > 0 && (
                                    <div className="replies">
                                        {comment.replies.map((reply, index) => (
                                            <div key={index} className="reply">
                                                <strong>{reply.user.name}</strong>
                                                <p>{reply.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
            <div className="pagination-controls">
                {Array.from({ length: Math.ceil(comments.length / COMMENTS_PER_PAGE) }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePagination(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
