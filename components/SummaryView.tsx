interface ActionItem {
  owner: string
  task: string
  due: string
}

interface Summary {
  tldr: string
  key_discussion_points?: string[]
  decisions: string[]
  action_items: ActionItem[]
  parking_lot: string[]
  transcript?: string
}

const appleFont = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"

const sectionLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'rgba(235,235,245,0.35)',
  display: 'block',
  marginBottom: '12px',
}

export function SummaryView({ summary }: { summary: Summary }) {
  return (
    <div style={{ fontFamily: appleFont }}>

      {/* Meeting Summary / What Happened — blue-tinted card */}
      {summary.tldr && (
        <div style={{
          background: 'rgba(10,132,255,0.08)',
          borderRadius: '12px',
          padding: '18px 20px',
          marginBottom: '28px',
          border: '1px solid rgba(10,132,255,0.2)',
        }}>
          <span style={{ ...sectionLabel, color: '#0a84ff', marginBottom: '8px' }}>Meeting Summary & What Happened</span>
          <p style={{
            color: '#ffffff',
            fontSize: '15px',
            lineHeight: 1.65,
            margin: 0,
            whiteSpace: 'pre-line',
          }}>
            {summary.tldr}
          </p>
        </div>
      )}

      {/* Key Discussion Points (if available) */}
      {summary.key_discussion_points && summary.key_discussion_points.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <span style={sectionLabel}>Key Discussion Points</span>
          <div style={{
            background: '#1c1c1e',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            {summary.key_discussion_points.map((pt, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '14px 16px',
                  borderBottom: i < summary.key_discussion_points!.length - 1 ? '1px solid #38383a' : 'none',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{
                  color: '#30d158',
                  fontSize: '14px',
                  fontWeight: 600,
                  flexShrink: 0,
                  paddingTop: '1px',
                }}>
                  •
                </span>
                <span style={{
                  color: 'rgba(235,235,245,0.85)',
                  fontSize: '15px',
                  lineHeight: 1.5,
                }}>
                  {pt}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Decisions */}
      {summary.decisions && summary.decisions.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <span style={sectionLabel}>Key Decisions</span>
          <div style={{
            background: '#1c1c1e',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            {summary.decisions.map((d, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '14px 16px',
                  borderBottom: i < summary.decisions.length - 1 ? '1px solid #38383a' : 'none',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{
                  color: '#0a84ff',
                  fontSize: '13px',
                  fontWeight: 600,
                  flexShrink: 0,
                  paddingTop: '1px',
                  minWidth: '20px',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{
                  color: 'rgba(235,235,245,0.85)',
                  fontSize: '15px',
                  lineHeight: 1.5,
                }}>
                  {d}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      {summary.action_items && summary.action_items.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <span style={sectionLabel}>Action Items & Next Steps</span>
          <div style={{
            background: '#1c1c1e',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr 100px',
              gap: '12px',
              padding: '10px 16px',
              borderBottom: '1px solid #38383a',
            }}>
              {['Owner / Team', 'Task', 'Due'].map(h => (
                <span key={h} style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'rgba(235,235,245,0.3)',
                }}>
                  {h}
                </span>
              ))}
            </div>
            {/* Table rows */}
            {summary.action_items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr 100px',
                  gap: '12px',
                  padding: '12px 16px',
                  borderBottom: i < summary.action_items.length - 1 ? '1px solid #38383a' : 'none',
                  alignItems: 'start',
                }}
              >
                <span style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {item.owner}
                </span>
                <span style={{
                  color: 'rgba(235,235,245,0.7)',
                  fontSize: '14px',
                  lineHeight: 1.5,
                }}>
                  {item.task}
                </span>
                <span style={{
                  color: 'rgba(235,235,245,0.4)',
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                }}>
                  {item.due}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parking Lot */}
      {summary.parking_lot && summary.parking_lot.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <span style={sectionLabel}>Parking Lot & Open Questions</span>
          <div style={{
            background: '#1c1c1e',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            {summary.parking_lot.map((p, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '12px 16px',
                  borderBottom: i < summary.parking_lot.length - 1 ? '1px solid #38383a' : 'none',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{
                  color: '#ffd60a',
                  flexShrink: 0,
                  fontSize: '14px',
                  lineHeight: 1.5,
                }}>
                  •
                </span>
                <span style={{
                  color: 'rgba(235,235,245,0.7)',
                  fontSize: '14px',
                  lineHeight: 1.5,
                }}>
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Transcript */}
      {summary.transcript && (
        <details style={{ marginTop: '8px' }}>
          <summary style={{
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            color: 'rgba(235,235,245,0.4)',
            listStyle: 'none',
            paddingTop: '16px',
            borderTop: '1px solid #38383a',
            userSelect: 'none',
          }}>
            Show raw transcript
          </summary>
          <pre style={{
            marginTop: '12px',
            fontSize: '13px',
            color: 'rgba(235,235,245,0.5)',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            padding: '16px',
            borderRadius: '12px',
            background: '#1c1c1e',
            overflowX: 'auto',
            fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
          }}>
            {summary.transcript}
          </pre>
        </details>
      )}
    </div>
  )
}

