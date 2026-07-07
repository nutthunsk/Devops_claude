import { useState } from 'react'
import { useApp } from '../store'
import { Modal } from '../components/ui'
import { Icon } from '../components/icons'
import { MOCK_COMMENTS, MOCK_TRENDING } from '../data/mock'

export default function Community() {
  const { posts, toggleVote, addPost, t } = useApp()
  const [openComments, setOpenComments] = useState({})
  const [showCompose, setShowCompose] = useState(false)

  const toggleComments = (id) =>
    setOpenComments((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('community.title')}</h1>
          <div className="page-sub">{t('community.subtitle')}</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCompose(true)}>{t('community.newPost')}</button>
      </div>

      <div className="feed-layout">
        <div className="feed">
          {posts.map((p) => {
            const comments = MOCK_COMMENTS[p.post_id] || []
            const open = openComments[p.post_id]
            return (
              <article className="card post-card" key={p.post_id}>
                <div className="post-head">
                  {p.author.avatar
                    ? <img src={p.author.avatar} alt="" onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />
                    : <span className="tx-icon" style={{ borderRadius: '50%' }}><Icon name="user" /></span>}
                  <div>
                    <div className="post-author">{p.author.name}{p.mine ? ` ${t('community.you')}` : ''}</div>
                    <div className="post-when">{p.created_at === 'Just now' ? t('community.justNow') : p.created_at}</div>
                  </div>
                  {p.tag && <span className="post-tag">#{p.tag}</span>}
                </div>
                <h2 className="post-title">{p.title}</h2>
                <p className="post-content">{p.content}</p>
                <div className="post-actions">
                  <button
                    className={`chip-btn${p.voted ? ' voted' : ''}`}
                    onClick={() => toggleVote(p.post_id)}
                    aria-pressed={p.voted}
                  >
                    <Icon name="arrow-up" size={13} strokeWidth={2.2} /> {p.upvotes.toLocaleString()}
                  </button>
                  <button className="chip-btn" onClick={() => toggleComments(p.post_id)} aria-expanded={!!open}>
                    <Icon name="message-circle" size={13} strokeWidth={2.2} /> {t('community.comments', { n: p.comments_count })}
                  </button>
                </div>
                {open && (
                  <div className="comments">
                    {comments.length === 0 && (
                      <div className="comment"><div className="comment-text">{t('community.noComments')}</div></div>
                    )}
                    {comments.map((c, i) => (
                      <div className="comment" key={i}>
                        <div className="comment-head">{c.author}<span>{c.when}</span></div>
                        <div className="comment-text">{c.text}</div>
                      </div>
                    ))}
                    {comments.length > 0 && comments.length < p.comments_count && (
                      <div className="post-when" style={{ textAlign: 'center' }}>
                        {t('community.showing', { shown: comments.length, total: p.comments_count })}
                      </div>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>

        <aside>
          <div className="card trending">
            <div className="card-head" style={{ marginBottom: 6 }}>
              <div className="card-title">{t('community.trending')}</div>
            </div>
            {MOCK_TRENDING.map((tp) => (
              <div className="trend-row" key={tp.tag}>
                <span className="trend-tag">{tp.tag}</span>
                <span className="trend-count">{t('community.posts', { n: tp.posts })}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {showCompose && <ComposeModal onAdd={addPost} onClose={() => setShowCompose(false)} />}
    </div>
  )
}

function ComposeModal({ onAdd, onClose }) {
  const { t } = useApp()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tag, setTag] = useState('General')
  const [touched, setTouched] = useState(false)
  const [saving, setSaving] = useState(false)

  const titleError = !title.trim() ? t('community.errTitle') : null
  const contentError = !content.trim() ? t('community.errContent') : null
  const invalid = Boolean(titleError || contentError)

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (invalid || saving) return
    setSaving(true)
    setTimeout(() => {
      onAdd({ title: title.trim(), content: content.trim(), tag })
      onClose()
    }, 500)
  }

  return (
    <Modal title={t('community.composeTitle')} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <div className={`field${touched && titleError ? ' invalid' : ''}`}>
          <label htmlFor="post-title">{t('community.titleField')}</label>
          <input id="post-title" autoFocus placeholder={t('community.titlePlaceholder')} value={title} onChange={(e) => setTitle(e.target.value)} />
          {touched && titleError && <div className="field-error">{titleError}</div>}
        </div>
        <div className={`field${touched && contentError ? ' invalid' : ''}`}>
          <label htmlFor="post-content">{t('community.body')}</label>
          <textarea id="post-content" rows="4" placeholder={t('community.bodyPlaceholder')} value={content} onChange={(e) => setContent(e.target.value)} />
          {touched && contentError && <div className="field-error">{contentError}</div>}
        </div>
        <div className="field">
          <label htmlFor="post-tag">{t('community.topic')}</label>
          <select id="post-tag" value={tag} onChange={(e) => setTag(e.target.value)}>
            {['General', 'Saving', 'Investing', 'Budgeting', 'Freelance', 'FirstJobber'].map((tg) => (
              <option key={tg}>{tg}</option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>{t('common.cancel')}</button>
          <button type="submit" className="btn btn-primary" disabled={saving || (touched && invalid)}>
            {saving && <span className="spinner" />}
            {saving ? t('community.posting') : t('community.post')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
