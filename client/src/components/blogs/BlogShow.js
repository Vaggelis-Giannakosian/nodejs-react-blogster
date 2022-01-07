import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom'
import {fetchBlog} from '../../actions';
import {useSelector} from "react-redux";

export default function BlogShow(props) {

    const {_id} = useParams();

    useEffect(() => {
        fetchBlog(_id);
    }, [_id]);

    const blog = useSelector(({blogs}) => blogs[_id]);

    if (!blog) return '';

    const {title, content, imageUrl} = blog;

    function renderImage() {
        return imageUrl
            ? <img src={imageUrl} alt=""/>
            : ''
    }

    return (
        <div>
            <h3>{title}</h3>
            <p>{content}</p>
            {renderImage()}
        </div>
    );
}
