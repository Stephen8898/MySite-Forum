const forumPopulator = new ForumPopulator();

$(document).ready(function() {
    displayPosts(json_context);

    $('#post-btn').on('click', submitForm);
    $('#reply-btn').on('click', submitForm);
});

const displayPosts = function(context, more_btn) {
    for (i = context.posts.length-1; i >= 0; --i) {
        forumPopulator.addObjectToContainer(context.posts[i], $('.posts-container'));
    }

    if (context.more) {
        if (more_btn == null)
            more_btn = forumPopulator.createMoreButton('posts', context.thread_id);
        
        more_btn.attr('index', context.index - context.offset);
        more_btn.on('click', fetchObjects);
        $('.posts-container').append(more_btn);
    }
}

const displayReplies = function(context, more_btn) {
    for(i = context.replies.length-1; i >= 0; --i) {
        forumPopulator.addObjectToContainer(context.replies[i], $(`#reply-container-${context.post_id}`));
        line_break = $('<hr>', {'class': 'my-4 bg-dark'});

        if(context.more || i != 0)
            $(`#reply-container-${context.post_id}`).append(line_break);   
    }

    if (context.more) {
        if (more_btn == null)
            more_btn = forumPopulator.createMoreButton('replies', context.post_id);
        
        more_btn.attr('index', context.index - context.offset);
        more_btn.on('click', fetchObjects);
        $(`#reply-container-${context.post_id}`).append(more_btn);
    }
}

const fetchObjects = function() {
    object = $(this);
    id = object.attr('value');
    index = object.attr('index');

    if (index == 0)
        return;

    is_more_btn = object.hasClass(`more-btn-for-posts`) ||  object.hasClass(`more-btn-for-replies-${id}`);
    flag = is_more_btn ? true : object.attr('display') == 'true';

    if (flag) {
        data = {'index': index, 'id': id}
        type = object.attr('object-type');
        
        var more;
        /**
         * This checks for whether 'this' is a 'more' button for retrieving more
         * posts/replies or is the button for displaying the first set of replies
         * for a post.
         * The 'Replies(n)' button.
         */
        if(is_more_btn) {
            more = object;
            object.remove();
        } else 
            object.attr('display', false);

        fetchObjectsAjax(`/fetch_${type}/`, data, more);    
    } else {
        object.attr('display', true);
        $(`#reply-container-${id}`).empty();
    }
}

const fetchObjectsAjax = function(url, data, more) {
    $.ajax({
        url: url,
        data: data,
        contentType: 'application/json',
        success: function(data) {
            if ('replies' in data)
                displayReplies(data, more);
            else if ('posts' in data) 
                displayPosts(data, more);
        }
    });
}

const displayReplyBox = function() {
    post_id = $(this).attr('value');
    thread_id = $('#reply-btn').attr('value');
    $('#reply-form').attr('action',`${thread_id}/post/${post_id}/reply/create`);
}

const submitForm = function() {
    if ($('#PostCenterBox').hasClass('show')) 
        $('#post-form').submit();
    else if ($('#ReplyCenterBox').hasClass('show')) 
        $('#reply-form').submit();
}