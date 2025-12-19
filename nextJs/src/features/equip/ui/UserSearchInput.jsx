'use client';

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from '@/shared/component';
import { equipApi } from '@/features/equip';

const UserSearchInput = ({ onUserSelect, label = '사용자', placeholder = '사용자명 검색' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSearch = async () => {
    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }
    const response = await equipApi.getTenantUsers({ params: { usrNm: searchTerm } });
    if (response && response.data) {
      setResults(response.data);
      setShowResults(true);
    }
  };

  const handleSelect = (user) => {
    setSearchTerm(user.usrNm);
    onUserSelect(user);
    setShowResults(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        label={label}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
      />
      <Button onClick={handleSearch} className="absolute right-0 top-0">
        검색
      </Button>
      {showResults && results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
          {results.map((user) => (
            <li key={user.usrId} onClick={() => handleSelect(user)} className="p-2 hover:bg-gray-100 cursor-pointer">
              {user.usrNm} ({user.deptNm})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

UserSearchInput.propTypes = {
  onUserSelect: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string
};

export default UserSearchInput;
