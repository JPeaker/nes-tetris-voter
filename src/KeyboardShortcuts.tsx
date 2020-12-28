import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'react-bootstrap';
import keyboard from './keyboard.png';
import './KeyboardShortcut.css';

export enum KeyboardShortcutVariant {
  VOTE = 'Vote',
  CREATE = 'Create',
}

interface KeyboardShortcutsProps {
  variant: KeyboardShortcutVariant,
  className?: string;
}

interface Shortcut {
  key: string,
  description: string,
}

const variantShortcuts: { [key: string]: Shortcut[] } = {
  all: [
    { key: '/', description: 'Jump to search field, to type ID number for a scenario' },
  ],
  [KeyboardShortcutVariant.VOTE]: [
    { key: 'Arrow Up', description: 'Move to previous possibility' },
    { key: 'Arrow Down', description: 'Move to next possibility' },
    { key: 'Enter', description: 'Open vote dialog, or confirm vote if dialog open' },
    { key: 'W', description: 'Prefer up-facing orientations when hovering over board. If there are multiple, find the next occurrence instead' },
    { key: 'A', description: 'Prefer left-facing orientations when hovering over board. If there are multiple, find the next occurrence instead' },
    { key: 'S', description: 'Prefer down-facing orientations when hovering over board. If there are multiple, find the next occurrence instead' },
    { key: 'D', description: 'Prefer right-facing orientations when hovering over board. If there are multiple, find the next occurrence instead' },
    { key: 'Escape', description: 'Stop preferring a particular orientation. If a dialog is open, close it' },
    { key: 'C', description: 'Copy a link to the current scenario to clipboard for sharing' },
    { key: 'N', description: 'Get a new scenario that you haven\'t voted on before' },
  ],
  [KeyboardShortcutVariant.CREATE]: [
    { key: 'Q', description: 'Choose "Grid Selection" mode' },
    { key: 'W', description: 'Choose "Current Piece" mode' },
    { key: 'E', description: 'Choose "Next Piece" mode' },
    { key: '1-9, 0', description: 'In "Grid Selection" mode, focus on the corresponding column' },
    { key: 'Arrow Up', description: 'When a column is focused, add a block one higher to the column' },
    { key: 'Arrow Down', description: 'When a column is focused, remove a block one lower in the column' },
    { key: 'Page Up', description: 'Same as Arrow Up, but add 5 blocks' },
    { key: 'Page Down', description: 'Same as Arrow Down, but remove 5 blocks' },
    { key: 'T/I/O/S/Z/J/L', description: 'In "Current Piece" or "Next Piece" mode, choose the corresponding piece' },
    { key: 'Enter', description: 'Create scenario' },
  ],
}

function KeyboardShortcuts({ variant, className }: KeyboardShortcutsProps) {
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const kHandler = (event: KeyboardEvent) => {
      if (event.code === 'KeyK') {
        setShowModal(!showModal);
      } else if (event.code === 'Enter') {
        setShowModal(false);
      }
    };

    window.addEventListener('keyup', kHandler);
    return () => window.removeEventListener('keyup', kHandler);
  });

  return <div onClick={() => setShowModal(true)} className={`keyboard-shortcut-wrapper ${className || ''}`}>
    <img className="keyboard-shortcut-icon" src={keyboard} />
    <h5>Keyboard shortcuts (K)</h5>
    <Modal className="modal-dialog-keyboard" centered show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Body>
        <Table bordered striped hover>
          <thead>
            <tr>
              <th>Key</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {(variantShortcuts[variant] as Shortcut[]).concat(variantShortcuts.all).map(shortcut => <tr key={shortcut.key}>
              <td>{shortcut.key}</td>
              <td>{shortcut.description}</td>
            </tr>)}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        Press <i>Esc</i> or <i>K</i> to close
      </Modal.Footer>
    </Modal>
  </div>;
}

export default KeyboardShortcuts;
