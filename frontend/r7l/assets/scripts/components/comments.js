import { userGet } from '../api/user.js';
import { escapeHtml } from '../utils/escape.js';
import { getComments, getReplies, createComment, deleteComment as apiDeleteComment } from '../api/comment.js';

let currentUser = null;

async function fetchCurrentUser() {
    if (currentUser) return currentUser;
    try {
        const user = await userGet();
        if (user && !user.error) {
            currentUser = user;
        }
    } catch (e) {
        console.error("Failed to fetch user", e);
    }
    return currentUser;
}

export async function renderComments(unitId, container) {
    container.dataset.currentUnitId = unitId;

    await fetchCurrentUser();

    if (container.dataset.currentUnitId != unitId) return;

    container.innerHTML = `
        <div class="comments-container">
            <h3 class="comments-header">Комментарии</h3>
            <div id="comment-form-container"></div>
            <div id="comments-list" class="comment-list">
                <div>Загрузка комментариев...</div>
            </div>
            <button id="load-more-comments" class="load-more-btn" style="display: none; margin-top: 20px; width: 100%;">Загрузить еще</button>
        </div>
    `;

    const listContainer = container.querySelector('#comments-list');
    const formContainer = container.querySelector('#comment-form-container');
    const loadMoreBtn = container.querySelector('#load-more-comments');

    renderCommentForm(unitId, formContainer, null, async () => {
        if (container.dataset.currentUnitId == unitId) {
            // Reset list on new comment
            listContainer.innerHTML = '';
            await loadAndRenderComments(unitId, listContainer, container, 0, loadMoreBtn);
        }
    });

    await loadAndRenderComments(unitId, listContainer, container, 0, loadMoreBtn);
}

async function loadAndRenderComments(unitId, container, mainContainer, offset = 0, loadMoreBtn) {
    try {
        const count = 10;
        // API: /api/Comment/{courseUnitId}/{sortAscending}/{since}/{count}
        const since = offset + 1;

        const comments = await getComments(unitId, since, count);

        if (mainContainer && mainContainer.dataset.currentUnitId != unitId) return;

        if (offset === 0) {
            container.innerHTML = '';
        }

        if (comments.length === 0 && offset === 0) {
            container.innerHTML = '<div style="opacity: 0.7;">Нет комментариев. Вы можете быть первым :)</div>';
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            return;
        }

        for (const comment of comments) {
            const commentEl = await createCommentElement(comment, unitId);
            container.appendChild(commentEl);
        }

        if (loadMoreBtn) {
            if (comments.length === count) {
                loadMoreBtn.style.display = 'block';
                loadMoreBtn.onclick = () => {
                    loadAndRenderComments(unitId, container, mainContainer, offset + count, loadMoreBtn);
                };
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }

    } catch (e) {
        console.error(e);
        if (mainContainer && mainContainer.dataset.currentUnitId == unitId && offset === 0) {
            container.innerHTML = '<div style="color: red;">Ошибка загрузки комментариев</div>';
        }
    }
}

async function createCommentElement(comment, unitId, level = 1) {
    const item = document.createElement('div');
    item.className = 'comment-item';
    item.dataset.id = comment.id;

    const isAdmin = currentUser && currentUser.positionName === 'admin';
    const canDelete = isAdmin;
    const canReply = level < 3;

    item.innerHTML = `
        <div class="comment-header">
            <span class="comment-author">${escapeHtml(comment.authorFirstName)} ${escapeHtml(comment.authorLastName)}</span>
            <span class="comment-date">${new Date(comment.publicationDateTime).toLocaleString()}</span>
        </div>
        <div class="comment-content">${escapeHtml(comment.content)}</div>
        <div class="comment-actions">
            ${canReply ? `<button class="comment-action-btn reply-btn">Ответить</button>` : ''}
            ${canDelete ? `<button class="comment-action-btn comment-delete-btn">Удалить</button>` : ''}
        </div>
        <div class="reply-form-container" style="display: none;"></div>
        <div class="replies-container" id="replies-${comment.id}"></div>
    `;

    if (canReply) {
        const replyBtn = item.querySelector('.reply-btn');
        const replyFormContainer = item.querySelector('.reply-form-container');

        replyBtn.onclick = () => {
            if (replyFormContainer.style.display === 'none') {
                replyFormContainer.style.display = 'block';
                if (replyFormContainer.innerHTML === '') {
                    renderCommentForm(unitId, replyFormContainer, comment.id, async () => {
                        replyFormContainer.style.display = 'none';
                        await loadReplies(unitId, comment.id, item.querySelector(`#replies-${comment.id}`), 0, null, level + 1);
                    });
                }
            } else {
                replyFormContainer.style.display = 'none';
            }
        };
    }

    if (canDelete) {
        const deleteBtn = item.querySelector('.comment-delete-btn');
        if (deleteBtn) {
            deleteBtn.onclick = async () => {
                if (confirm('Вы уверены, что хотите удалить этот комментарий?')) {
                    try {
                        await apiDeleteComment(comment.id);
                        item.remove();
                    } catch (e) {
                        console.error(e);
                        alert('Не удалось удалить комментарий');
                    }
                }
            };
        }
    }

    if (comment.repliesCount > 0) {
        const repliesContainer = item.querySelector(`#replies-${comment.id}`);
        const loadRepliesBtn = document.createElement('button');
        loadRepliesBtn.className = 'load-more-btn';
        loadRepliesBtn.textContent = `Показать ответы (${comment.repliesCount})`;
        loadRepliesBtn.onclick = async () => {
            loadRepliesBtn.remove();
            await loadReplies(unitId, comment.id, repliesContainer, 0, null, level + 1);
        };
        repliesContainer.appendChild(loadRepliesBtn);
    }

    return item;
}

async function loadReplies(unitId, commentId, container, offset = 0, loadMoreBtn, level = 2) {
    try {
        const count = 5;
        const since = offset + 1;
        // API: /api/Comment/{courseUnitId}/RepliesTo/{commentId}/{since}/{count}
        const replies = await getReplies(unitId, commentId, since, count);

        if (offset === 0) container.innerHTML = '';

        for (const reply of replies) {
            const replyEl = await createCommentElement(reply, unitId, level);
            container.appendChild(replyEl);
        }

        if (replies.length === count) {
            if (!loadMoreBtn) {
                loadMoreBtn = document.createElement('button');
                loadMoreBtn.className = 'load-more-btn';
                loadMoreBtn.style.marginLeft = '0';
                container.parentNode.appendChild(loadMoreBtn);
            }
            const oldBtn = container.querySelector('.load-more-replies-btn');
            if (oldBtn) oldBtn.remove();

            const newBtn = document.createElement('button');
            newBtn.className = 'load-more-btn load-more-replies-btn';
            newBtn.textContent = 'Показать еще ответы';
            newBtn.onclick = async () => {
                newBtn.remove();
                await loadReplies(unitId, commentId, container, offset + count, null, level);
            };
            container.appendChild(newBtn);
        }

    } catch (e) {
        console.error(e);
        if (offset === 0) container.innerHTML = '<div style="color: red;">Ошибка загрузки ответов</div>';
    }
}

function renderCommentForm(unitId, container, replyToId, onSuccess) {
    if (!currentUser) {
        container.innerHTML = '<div style="padding: 10px;">Войдите, чтобы оставить комментарий.</div>';
        return;
    }

    const form = document.createElement('form');
    form.className = 'comment-form';
    form.innerHTML = `
        <textarea name="content" placeholder="${replyToId ? 'Ваш ответ...' : 'Напишите комментарий...'}" required></textarea>
        <button type="submit">Отправить</button>
    `;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const content = form.content.value;
        const submitBtn = form.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        try {
            const success = await postComment(unitId, content, replyToId);
            if (success) {
                form.reset();
                if (onSuccess) onSuccess();
            } else {
                alert('Ошибка при отправке комментария');
            }
        } catch (e) {
            console.error(e);
            alert('Ошибка при отправке комментария');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить';
        }
    };

    container.appendChild(form);
}

async function postComment(unitId, content, replyToId) {
    try {
        const body = {
            courseUnitId: unitId,
            authorId: currentUser.id,
            content: content,
            replyToCommentId: replyToId || null
        };

        await createComment(body);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}
