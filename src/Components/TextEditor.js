import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faUnderline, faLink, faImage } from '@fortawesome/free-solid-svg-icons';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const MAX_CHAR_LIMIT = 250;

const TextEditor = ({ onSubmitComment, comments, sortOption, setSortOption }) => {
    const [content, setContent] = useState('');
    const editorRef = useRef(null);
    const navigate = useNavigate();

    const handleFormatting = (command) => {
        document.execCommand(command, false, '');
        editorRef.current.focus();
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const imageUrl = reader.result;
                document.execCommand('insertImage', false, imageUrl);
            };
            reader.readAsDataURL(file);
            editorRef.current.focus();
        }
    };

    const handleKeyUp = () => {
        const text = editorRef.current.innerText;
        if (text.length > MAX_CHAR_LIMIT) {
            editorRef.current.innerText = text.slice(0, MAX_CHAR_LIMIT);
            setContent(text.slice(0, MAX_CHAR_LIMIT));
        } else {
            setContent(text);
        }
    };

    const handleLinkInsert = () => {
        const url = prompt('Enter the URL:');
        if (url) {
            document.execCommand('createLink', false, url);
            editorRef.current.focus();
        }
    };

    const handleSubmit = () => {
        if (content.trim()) {
            onSubmitComment(content);
            setContent('');
            editorRef.current.innerText = '';
            toast.success('Comment added successfully!');
        } else {
            toast.error('Comment cannot be empty!');
        }
    };

    const handleLogout = () => {
        googleLogout();
        console.log('Logout successful!');
        navigate('/login');
    };

    return (
        <div className="card-container">
            <div className="logout-container">
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            <div className="text-editor-card">
                <div className="header">
                    <div className="comments-info">
                        <span>Comments ({comments?.length || 0})</span>
                    </div>
                    <div className="sort-buttons">
                        <button 
                            onClick={() => setSortOption('latest')} 
                            className={sortOption === 'latest' ? 'active' : ''}
                        >
                            Latest
                        </button>
                        <button 
                            onClick={() => setSortOption('popularity')} 
                            className={sortOption === 'popularity' ? 'active' : ''}
                        >
                            Popular
                        </button>
                    </div>
                </div>
                <div 
                    ref={editorRef}
                    contentEditable
                    className="editor"
                    onKeyUp={handleKeyUp}
                    suppressContentEditableWarning={true}
                >
                </div>
                <div className="editor-controls">
                    <div className="char-count">{content.length}/{MAX_CHAR_LIMIT}</div>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="image-upload"
                        id="image-upload"
                    />
                    <label htmlFor="image-upload">
                        <button className="icon-button">
                            <FontAwesomeIcon icon={faImage} />
                        </button>
                    </label>
                    <button className="icon-button" onClick={() => handleFormatting('bold')}>
                        <FontAwesomeIcon icon={faBold} />
                    </button>
                    <button className="icon-button" onClick={() => handleFormatting('italic')}>
                        <FontAwesomeIcon icon={faItalic} />
                    </button>
                    <button className="icon-button" onClick={() => handleFormatting('underline')}>
                        <FontAwesomeIcon icon={faUnderline} />
                    </button>
                    <button className="icon-button" onClick={handleLinkInsert}>
                        <FontAwesomeIcon icon={faLink} />
                    </button>
                    <div className="submit-container">
                        <button className="submit-button" onClick={handleSubmit}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Define PropTypes for the component
TextEditor.propTypes = {
    onSubmitComment: PropTypes.func.isRequired,
    comments: PropTypes.array,
    sortOption: PropTypes.string.isRequired,
    setSortOption: PropTypes.func.isRequired,
};

// Provide default values for props
TextEditor.defaultProps = {
    comments: [],
};

export default TextEditor;
