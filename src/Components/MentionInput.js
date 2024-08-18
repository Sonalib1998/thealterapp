import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const MAX_CHAR_LIMIT = 250;

const MentionInput = ({ value, onChange }) => {
    const [content, setContent] = useState(value);
    const [showMentions, setShowMentions] = useState(false);
    const [mentionList, setMentionList] = useState([]);
    const [search, setSearch] = useState('');

    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            const imageUrl = reader.result;
            const quill = document.querySelector('.ql-editor');
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', imageUrl);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleChange = (content) => {
        if (content.length <= MAX_CHAR_LIMIT) {
            setContent(content);
            onChange(content);
        }
    };

    const handleKeyUp = (event) => {
        const { key, target } = event;
        if (key === '@') {
            setShowMentions(true);
        } else if (key === 'Enter') {
            setShowMentions(false);
        } else {
            setSearch(target.innerText);
            const mentions = ['Alice', 'Bob', 'Charlie'];
            setMentionList(
                mentions.filter(name => name.toLowerCase().includes(search.toLowerCase()))
            );
        }
    };

    const handleMentionClick = (mention) => {
        const quill = document.querySelector('.ql-editor');
        const range = quill.getSelection();
        const mentionText = `@${mention}`;
        quill.insertText(range.index, mentionText);
        setShowMentions(false);
    };

    return (
        <div>
            <input 
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginBottom: '10px' }}
            />
            <ReactQuill 
                value={content}
                onChange={handleChange}
                onKeyUp={handleKeyUp}
                modules={MentionInput.modules}
            />
            {showMentions && (
                <div className="mention-dropdown">
                    {mentionList.map((mention, index) => (
                        <div 
                            key={index} 
                            onClick={() => handleMentionClick(mention)}
                            className="mention-item"
                        >
                            {mention}
                        </div>
                    ))}
                </div>
            )}
            <div className="char-count">
                {content.length}/{MAX_CHAR_LIMIT}
            </div>
        </div>
    );
};

MentionInput.modules = {
    toolbar: [
        [{ 'font': [] }],
        [{ 'header': '1' }, { 'header': '2' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline'],
        ['link'],
        [{ 'align': [] }],
        ['clean']
    ],
};

export default MentionInput;
