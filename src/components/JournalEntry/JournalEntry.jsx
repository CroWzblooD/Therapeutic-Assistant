import './JournalEntry.scss';

function JournalEntry({ setEntryText,
    entryText, handleAddEntry }) {
    return (
        <div className="journal-entry">
            <textarea className="journal-entry__field" name="" id="" cols="30" rows="2" placeholder='Your journal entry...'
                value={entryText}
                onChange={(e) => {
                    setEntryText(e.target.value)
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleAddEntry(entryText);
                        setEntryText('');
                    }
                }}
            >

            </textarea>
        </div>
    )
}

export default JournalEntry;